from langchain_openai import ChatOpenAI
from apps.resumes.services.resume_schema import ResumeStructuredOutput
from langsmith import traceable
from dotenv import load_dotenv
load_dotenv()
import os

llm = ChatOpenAI(
    model="gpt-4o-mini", 
    temperature=0,
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    
)

structured_llm = llm.with_structured_output(ResumeStructuredOutput)

def parse_resume_with_llm(resume_text: str) -> ResumeStructuredOutput:
    """
    Extract structured resume data using LLM.
    No prompt, no schema tokens, minimal cost.
    """
    return structured_llm.invoke(resume_text)


