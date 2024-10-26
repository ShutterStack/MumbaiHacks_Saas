# install dependencies before running
!pip install pymongo[srv] transformers langchain

# importing modules
from pymongo import MongoClient
from transformers import pipeline
import re
from collections import Counter

# MongoDB setup
MONGODB_URI ="mongodb+srv://aiworkspaceadku:FstomozFvaR6maVs@cluster0.5dtl1.mongodb.net/AiWork"

DATABASE_NAME = "AiWork"
COLLECTION_NAME = "tasks"

# Connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]


# Set up the QA pipeline using Hugging Face Transformers
qa_model = pipeline("question-answering")

# Function to retrieve detailed project information
def retrieve_project_summary(query):
    tokens = re.findall(r'\b\w+\b', query.lower())

    # Query to find tasks associated with the project mentioned in the query
    results = collection.find({
        "$or": [
            {"title": {"$regex": "|".join(tokens), "$options": "i"}},
            {"status": {"$regex": "|".join(tokens), "$options": "i"}},
            {"project": {"$regex": "|".join(tokens), "$options": "i"}},
        ]
    })

    # Process results for summary
    completed_tasks = 0
    pending_tasks = 0
    task_count = 0
    user_tasks = Counter()

    for result in results:
        task_count += 1
        assigned_users = result.get('assignedTo', [])
        status = result.get('status', '').lower()

        # Count tasks based on status
        if status == "completed":
            completed_tasks += 1
            user_tasks.update(assigned_users)
        elif status == "todo" or status == "in-progress":
            pending_tasks += 1
            user_tasks.update(assigned_users)

    # Determine the user with the most completed tasks
    max_user = user_tasks.most_common(1)
    top_contributor = max_user[0][0] if max_user else "No one"

    # Construct a project summary context
    if task_count > 0:
        summary = (
            f"Project Summary:\nTotal Tasks: {task_count}\n"
            f"Completed Tasks: {completed_tasks}\nPending Tasks: {pending_tasks}\n"
            f"Top Contributor: {top_contributor} with {user_tasks[top_contributor]} tasks completed."
        )
    else:
        summary = "No tasks found for this project."

    return summary

# Function to answer the user's query
def answer_query(query):
    # Retrieve the project summary as context
    retrieved_data = retrieve_project_summary(query)

    # Use QA model to generate answer
    if retrieved_data:
        answer = qa_model(question=query, context=retrieved_data)
        return answer['answer']
    else:
        return "Sorry, I couldn't find any information on that topic."

# Sample Query 
user_query = "what is the status of task1proj2"
response = answer_query(user_query)
print("Response:", response)

