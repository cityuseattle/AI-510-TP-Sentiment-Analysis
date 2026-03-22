FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project (including artifacts folder)
COPY . .

# Expose port if using Flask/FastAPI
EXPOSE 8000

# Start the inference script (update if your file name differs)
CMD ["python", "AI510-Project/model/predict.py"]
