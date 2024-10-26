from langchain.schema.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
import io

class Transcript:
    """
    The Transcript class represents a transcript of a conversation. It can be used to load a transcript from a file,
    split it into chunks, and count the number of tokens in it.

    Attributes:
        file_path (str): The path to the transcript file.
        transcript_string (str): The transcript string.
        approx_total_tokens (int): The approximate total number of tokens in the transcript.
        prompt_chunks (list): A list of chunks of the transcript.
    """
    def __init__(self, timestamp, file_path=None):
        self.file_path = file_path
        self.timestamp = timestamp
        self.clean_file_path = None
        self.transcript_string = None
        self.attendees = None
        self.approx_total_tokens = None
        self.prompt_chunks = None

    def load(self):
        """Load the transcript from the file."""
        self._get_attendees()  # Extract attendees
        self._clean()  # Clean and load transcript

        with open(self.clean_file_path, "r") as f:
            self.transcript_string = f.read()

        self.approx_total_tokens = self._approx_tokens(self.transcript_string)
        self.prompt_chunks = self._split_transcript_into_chunks(self.transcript_string)
        return self

    def _approx_tokens(self, prompt: str) -> int:
        """
        Counts the approximate number of tokens in the transcript.

        Args:
            prompt (str): The transcript string.

        Returns:
            int: The approximate number of tokens.
        """
        words = prompt.split()
        num_words = len(words)
        approx_num_tokens = int(num_words * (100 / 60))
        return approx_num_tokens

    def _split_transcript_into_chunks(self, transcript: str, chunk_size: int = 28000) -> list:
        """
        Splits the input transcript into chunks of the specified size.

        Args:
            transcript (str): The input transcript.
            chunk_size (int): The size of the chunks.

        Returns:
            list: A list of chunks.
        """
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=50,
            length_function=len
        )
        documents = text_splitter.create_documents([self.transcript_string])
        return documents

    def _get_attendees(self):
        """
        Extracts attendees from the transcript file.

        Returns:
            self: The modified instance with the attendees attribute set.
        """
        with open(self.file_path, "r") as f:
            lines = f.readlines()
            index = lines.index("Attendees\n")
            self.attendees = lines[index + 1]
        return self

    def _clean(self):
        """
        Cleans the raw transcript down to pure meeting contributions and saves it to a cleaned file.

        Returns:
            self: The modified instance with the cleaned transcript file.
        """
        with open(self.file_path, "r") as f:
            lines = f.readlines()
            clean_lines = lines[5:-1]  # Remove header and footer

        self.clean_file_path = f"{self.file_path.split('.txt')[0]}_cleaned.txt"
        with open(self.clean_file_path, "w") as f:
            f.writelines(clean_lines)
        return self

if __name__ == '__main__':
    transcript = Transcript(timestamp="20231026", file_path="./rsc/transcript1_raw.txt").load()
    print("Hello World!")
