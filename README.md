# AI Document Search System (RAG) – Backend

## Overview

This backend service powers an **AI Document Search System** using a **Retrieval Augmented Generation (RAG)** architecture. It allows users to upload documents (PDFs), converts them into vector embeddings, stores them in a vector database, and answers user queries using context retrieved from those documents.

The system uses **semantic search** to find the most relevant document sections and combines them with a Large Language Model (LLM) to generate accurate responses.

---

# Architecture

```
Client (React Frontend)
        ↓
Express API Server
        ↓
Document Upload Service
        ↓
PDF Text Extraction
        ↓
Text Chunking
        ↓
Embedding Generation (OpenAI)
        ↓
Vector Storage (PostgreSQL + pgvector)
        ↓
Similarity Search
        ↓
Context Retrieval
        ↓
LLM Answer Generation
```

---

# Tech Stack

### Backend

* Node.js
* Express.js

### AI / LLM

* OpenAI API
* Retrieval Augmented Generation (RAG)

### Document Processing

* pdf-parse

### Database

* PostgreSQL
* pgvector extension

### Other Libraries

* multer (file uploads)
* dotenv (environment variables)
* cors

---

# Features

The backend supports the following capabilities:

### 1. PDF Upload System

Users can upload PDF documents through the API. Uploaded documents are processed and indexed for semantic search.

### 2. Document Text Extraction

The system extracts text from PDF documents using **pdf-parse**.

### 3. Text Chunking

Large documents are split into smaller chunks so embeddings can be generated efficiently and retrieved more accurately.

### 4. Embedding Generation

Each chunk is converted into a **vector embedding** using the OpenAI embeddings API.

### 5. Vector Storage

Embeddings are stored inside PostgreSQL using **pgvector**, enabling similarity search.

### 6. Semantic Search

When a user asks a question, the system retrieves the most relevant chunks based on vector similarity.

### 7. Retrieval Augmented Generation (RAG)

The retrieved document chunks are sent to the LLM along with the user question to generate a contextual answer.

---

# Project Structure

```
backend
│
├── config
│   └── db.js                # PostgreSQL database connection
│
├── controllers
│   ├── uploadController.js  # Handles document upload logic
│   └── chatController.js    # Handles user question requests
│
├── routes
│   ├── upload.js            # Upload API routes
│   └── chat.js              # Chat API routes
│
├── services
│   ├── pdfService.js        # Extracts text from PDFs
│   ├── embeddingService.js  # Generates embeddings using OpenAI
│   ├── vectorService.js     # Stores and retrieves vectors
│   └── ragService.js        # RAG pipeline logic
│
├── utils
│   └── chunkText.js         # Splits text into smaller chunks
│
├── app.js                   # Express application configuration
├── server.js                # Server entry point
└── .env                     # Environment variables
```

---

# Installation

## 1. Clone the Repository

```
git clone https://github.com/yourusername/ai-doc-search-rag.git
cd ai-doc-search-rag/backend
```

---

## 2. Install Dependencies

```
npm install
```

Dependencies used:

```
express
cors
dotenv
multer
pdf-parse
openai
pg
pgvector
```

Development dependency:

```
nodemon
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

```
PORT=5000

DATABASE_URL=postgresql://username:password@localhost:5432/ragdb

OPENAI_API_KEY=your_openai_api_key
```

---

# Database Setup

Install PostgreSQL and enable the **pgvector** extension.

## Enable pgvector

Run this in PostgreSQL:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## Create Documents Table

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding VECTOR(1536),
    metadata JSONB
);
```

Explanation:

* **content** – text chunk from document
* **embedding** – vector representation of the chunk
* **metadata** – optional document information

---

# API Endpoints

## 1. Upload Document

Upload a PDF file and index it into the vector database.

### Endpoint

```
POST /api/upload
```

### Request

Form-data

```
file: PDF document
```

### Response

```
{
  "message": "Document indexed successfully"
}
```

### Processing Steps

1. Receive uploaded file using **multer**
2. Extract text using **pdfService**
3. Split text into chunks using **chunkText**
4. Generate embeddings for each chunk
5. Store embeddings in PostgreSQL

---

## 2. Ask Question

Query the document knowledge base.

### Endpoint

```
POST /api/chat
```

### Request Body

```
{
  "question": "What is the leave policy?"
}
```

### Response

```
{
  "answer": "Employees are entitled to 20 days of annual leave..."
}
```

### Processing Steps

1. Generate embedding for the user question
2. Perform similarity search in vector database
3. Retrieve top matching chunks
4. Combine chunks as context
5. Send context + question to OpenAI
6. Return generated answer

---

# RAG Pipeline

The backend implements a **Retrieval Augmented Generation pipeline**.

### Step 1 – Query Embedding

User question is converted into a vector embedding.

### Step 2 – Vector Similarity Search

The query embedding is compared with stored document embeddings.

PostgreSQL query example:

```sql
SELECT content
FROM documents
ORDER BY embedding <=> $1
LIMIT 5;
```

The `<=>` operator computes **cosine similarity**.

---

### Step 3 – Context Retrieval

The most relevant document chunks are retrieved.

Example:

```
Chunk 1: Leave policy states employees get 20 days leave
Chunk 2: Sick leave policy allows 10 days per year
```

---

### Step 4 – LLM Generation

The chunks are combined with the user question:

```
Context:
{retrieved_chunks}

Question:
{user_question}
```

The prompt is sent to the LLM.

---

### Step 5 – AI Response

The LLM generates an answer using the document context.

---

# Running the Backend

Start the development server:

```
npm run dev
```

Server runs on:

```
http://localhost:5000
```

Health check endpoint:

```
GET /health
```

Response:

```
{
  "status": "ok"
}
```

---

# Error Handling

The backend includes basic error handling for:

* invalid file uploads
* PDF parsing errors
* embedding generation failures
* database connection issues
* empty search results

---

# Future Improvements

Possible improvements for production deployment:

* authentication and user accounts
* document metadata support
* multi-document search
* streaming responses from LLM
* caching embeddings
* document deletion
* rate limiting
* logging and monitoring

---

# Use Cases

This system can be used for:

* enterprise document search
* company policy assistants
* legal document analysis
* knowledge base chatbots
* internal AI assistants

---

# License

MIT License
