import os
import datetime
from flask import Flask, render_template, request
from rsc.llm_main import SummarizationSession

app = Flask(__name__)

# Create a directory for uploaded files if it doesn't exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/success', methods=['POST'])
def success():
    if request.method == 'POST':
        # Get the file input
        f = request.files['file']

        # Get checkbox input values
        data_cleaning = request.form.get('data_cleaning')
        prompt_structuring = request.form.get('prompt_structuring')
        iterative_prompting = request.form.get('iterative_prompting')

        print(f"Data Cleaning: {data_cleaning}")
        print(f"Prompt Structuring: {prompt_structuring}")
        print(f"Iterative Prompting: {iterative_prompting}")

        # Generate a unique timestamp for file naming
        ts = int(datetime.datetime.now().timestamp() * 1000)
        file_path = os.path.join(UPLOAD_FOLDER, f"{ts}_input.txt")

        # Save the file locally
        f.save(file_path)

        # Initialize summarization session using the local file path
        session = SummarizationSession(file_path=file_path, timestamp=ts)
        sum_result = session()

        # Render the result in an HTML template
        return render_template("acknowledgement.html", summary=sum_result)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
  