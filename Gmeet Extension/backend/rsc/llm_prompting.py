from transformers import pipeline

# Initialize the Hugging Face summarization model
summarization_pipeline = pipeline("summarization", model="facebook/bart-large-cnn")

# Updated function to call Hugging Face model
def text_model_api_call(prompt_chunk, attendees):
    prompt = f"""SYSTEM: You are truthful and never lie. The following is a list of meeting attendees:
    {attendees}

    The following is a meeting transcript:
    Beginning of transcript:
    {prompt_chunk}
    End of Transcript

    Summarize each attendee's contributions in bullet points.
    """
    response = summarization_pipeline(prompt, max_length=1024, truncation=True)
    return response[0]['summary_text']
