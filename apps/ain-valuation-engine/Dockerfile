FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install pre-commit
RUN pip install 'numpy<2.3' 'numba<0.59' 'llvmlite<0.40'
RUN pre-commit install

# Copy project files
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    ENVIRONMENT=production

# Optionally run a basic test to verify setup
# RUN pytest tests/test_basic.py -v

# Default to bash for dev/test
CMD ["bash"]