from transformers import pipeline
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Initialize the Hugging Face summarization pipeline
summarization_pipeline = pipeline("summarization", model="facebook/bart-large-cnn")

# Defining prompt templates as before
chunk_summarization_prompt = PromptTemplate(
    input_variables=["attendees", "chunk_to_summarize"],
    template="""/
    SYSTEM: You are truthful and never lie. Never make up facts and if you are not 100% sure, reply with why you cannot answer in a truthful way.

    The following is the list of meeting attendees:
    {attendees}

    The following is a meeting transcript with the format:
    [attendee]: [contribution]

    Beginning of transcript:
    {chunk_to_summarize}
    End of Transcript

    Summarize each attendee's contributions in bullet points.
    Provide exactly one summary per attendee.
    """
)

# Summarization Chain - Revised to use Hugging Face transformers
def run_simple_summarization_chain(attendees: str, prompt_chunk: str):
    # Format prompt for the summarization pipeline
    prompt = chunk_summarization_prompt.format(attendees=attendees, chunk_to_summarize=prompt_chunk)
    # Generate summary using the Hugging Face summarization pipeline
    response = summarization_pipeline(prompt, max_length=1024, truncation=True)
    return response[0]['summary_text']

def run_meta_summarization_chain(attendees: str, summarized_chunks: str):
    prompt = f"""SYSTEM: You are truthful and never lie... (meta summarization prompt format here)"""
    response = summarization_pipeline(prompt, max_length=1024, truncation=True)
    return response[0]['summary_text']

# Refinement function
def run_refine_documents_chain(attendees: str, prompt_chunks: list):
    responses = []
    for chunk in prompt_chunks:
        prompt = chunk_summarization_prompt.format(attendees=attendees, chunk_to_summarize=chunk)
        response = summarization_pipeline(prompt, max_length=1024, truncation=True)
        responses.append(response[0]['summary_text'])
    return responses
