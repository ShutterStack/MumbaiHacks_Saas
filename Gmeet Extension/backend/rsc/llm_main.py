from rsc.langchain_prompting import run_simple_summarization_chain, run_meta_summarization_chain


class SummarizationSession:
    def __init__(self, timestamp, file_path=None):
        self.file_path = file_path
        self.ts = timestamp

    def __call__(self):
        # Loading the transcript
        transcript_object = self._load_transcript()

        # Summarize each chunk
        output = []
        for count, prompt_chunk in enumerate(transcript_object.prompt_chunks):
            output.append(f"##### Summarization Chunk {count} #####")
            output.append(run_simple_summarization_chain(attendees=transcript_object.attendees, prompt_chunk=prompt_chunk))

        # Combine and summarize all chunks
        summarized_chunks_string = "\n".join(output)
        sequential_summary = run_meta_summarization_chain(attendees=transcript_object.attendees, summarized_chunks=summarized_chunks_string)

        # Save output locally
        self._write_to_file([sequential_summary], f"{self.ts}_summary.txt")

        return sequential_summary

    def _load_transcript(self):
        # Implement the transcript loading logic as needed
        pass

    def _write_to_file(self, list_of_strings, file_path) -> None:
        with open(file_path, "w") as f:
            for string in list_of_strings:
                f.write(string + "\n")
