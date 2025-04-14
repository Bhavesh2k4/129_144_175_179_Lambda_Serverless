# Lambda Serverless Clone 🧬

This is a custom-built **Lambda-style serverless function execution platform**, built using Next.js, PostgreSQL, and AWS S3. It supports **authentication**, **function uploads**, and **execution via Docker or Nanos unikernel**.

---

## 🌐 Features

### 🔐 Authentication
- Sign in via **Credentials**, **Google OAuth**, or **GitHub OAuth**
- Email **verification** on sign-up (via [resend.com](https://resend.com))
- **Password reset** support via email for credentials users

### 👤 User Dashboard
- Authenticated users can:
  - Upload code functions (Python or Node.js)
  - Configure runtime, timeout, and memory
  - View and manage their uploaded functions

### ⚙️ Function Storage
- **Metadata** (handler, timeout, runtime, etc.) is stored in **PostgreSQL**
- **Function code** is uploaded and stored in **AWS S3**, within a unique folder for each user

### 🚀 Function Execution
- HTTP endpoint to execute uploaded code
- Two execution options:
  1. **Docker** (standard container runtime)
  2. **Nanos** (unikernel for optimized lightweight execution)
- Optional CLI parameters passed via query string

---

## 🧪 Example API Execution

### Endpoint:
```http
GET /api/function/[userId]/[handler]/docker?arg1=foo&arg2=bar
GET /api/function/[userId]/[handler]/nanos?arg1=foo&arg2=bar
```

---

## 🛠️ Tech Stack

| Feature           | Tech Used                |
|-------------------|--------------------------|
| Frontend          | Next.js App Router       |
| Authentication    | Auth.js                  |
| DB ORM            | Prisma                   |
| Database          | PostgreSQL (serverless)  |
| Object Storage    | AWS S3                   |
| Container Runtime | Docker                   |
| Unikernel Runner  | OPS (Nanos)              |

---

## 📁 Example Function Code

```python
# cloud.py

def calculator(a, b):
    return {
        "add": a + b,
        "subtract": a - b,
        "multiply": a * b,
        "divide": a / b if b != 0 else "undefined",
        "remainder": a % b if b != 0 else "undefined"
    }

if __name__ == "__main__":
    import sys

    try:
        a = float(sys.argv[1])
        b = float(sys.argv[2])
    except (IndexError, ValueError):
        print("Usage: python cloud.py <num1> <num2>")
        sys.exit(1)

    result = calculator(a, b)
    for op, value in result.items():
        print(f"{op}: {value}", end=" ")
```

## 🧾 Example Flow

1. **User registers or logs in**
   - Supports OAuth (GitHub, Google) or credentials
2. **User uploads a Python function**
   - Example: `calculator.py`
3. **User selects runtime environment**
   - Docker (containerized)
   - Nanos (via OPS unikernel)
4. **Function metadata is saved to PostgreSQL**
   - Includes user ID, filename, runtime, timestamps, etc.
5. **Function code is uploaded to S3**
   - Stored securely in your configured AWS bucket
6. **On invocation**, the system:
   - Downloads the code from S3
   - Reads metadata from the database
   - Executes the function using:
     - 🐳 A Docker container **or**
     - ⚡ A Nanos unikernel built with OPS
7. **Output is captured** and returned as JSON

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

### 2.Generate Auth Secret (creates .env.local)

```bash
npx auth secret > .env.local
```

### 3. Configure .env

```bash
DATABASE_URL=                     # PostgreSQL connection string
AWS_ACCESS_KEY_ID=               # Your AWS access key
AWS_SECRET_ACCESS_KEY=           # Your AWS secret
AWS_REGION=                      # e.g. us-east-1
AWS_S3_BUCKET=                   # Your S3 bucket name
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=                  # For email verification & password reset
```
## 🐳 Docker Installation & Setup

Docker is required to run uploaded functions inside containers.

### ✅ 1. Install Docker

- Download Docker Desktop from:  
  [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

- Follow installation steps for your OS (macOS, Windows, Linux).

---

### 📦 2. Verify Docker Installation

Once installed, verify it works:

```bash
docker --version
```










