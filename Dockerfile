FROM python:3.10-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project (including AI510-Project folder)
COPY . .

# Move into the folder where predict.py actually lives
WORKDIR /app/AI510-Project/model

EXPOSE 5000

# Run predict.py from inside its own folder
CMD ["python", "predict.py"]