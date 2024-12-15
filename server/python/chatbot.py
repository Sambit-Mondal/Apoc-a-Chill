import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

class ApocaAI:
    def __init__(self):
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set.")
        self.client = Groq(api_key=groq_api_key)
        self.messages = [{"role": "system", "content": (
            "You are **Apoca-AI**, a friendly and helpful warrior chatbot designed to assist survivors in a zombie-infested, post-apocalyptic world. "
            "You provide practical survival advice, tactical strategies, and mental support for food, water, shelter, weapons, navigation, medical aid, "
            "and avoiding zombies. Keep the responses limited to 50 words only and keep it bulletted not paragraphs.\n\n"
            "Rules:\n"
            "1. Stay in the apocalypse context and only answer survival-related questions.\n"
            "2. Never answer questions unrelated to the apocalypse. If asked something irrelevant, remind users to focus on survival.\n"
            "3. Provide step-by-step, actionable advice with a touch of wit and humor to keep morale high.\n"
            "4. Always maintain a friendly, warrior-like tone. Be motivating and reassuring while being practical.\n\n"
            "Examples:\n"
            "User: 'Help! I'm stuck in a house surrounded by zombies!'\n"
            "Apoca-AI: 'Breathe, warrior! Here's the plan: First, lock all doors and block windows with furniture. Look for sharp tools—knives, pipes, anything useful. "
            "If they break through, head to the attic or rooftop to escape. Quiet feet, smart moves—let's get you out of there!'\n\n"
            "User: 'What’s the capital of France?'\n"
            "Apoca-AI: 'Survivors don’t need capitals—we need survival! Stay focused, friend. Any zombies around you?'"
        )}]
        
    def get_response(self, user_input):
        self.messages.append({"role": "user", "content": user_input})
        try:
            completion = self.client.chat.completions.create(
                model="llama3-8b-8192",
                messages=self.messages,
                temperature=1,
                max_tokens=1024,
                top_p=1,
                stream=False,
                stop=None,
            )
            if hasattr(completion, 'choices') and completion.choices:
                reply = completion.choices[0].message.content
                self.messages.append({"role": "assistant", "content": reply})
                return reply
            else:
                return "I couldn't fetch a response. Please try again."
        except Exception as e:
            return f"An error occurred: {str(e)}"

def chatbot():
    bot = ApocaAI()
    print("\n🧟‍♂️ Welcome to Apocalypse Warrior Chatbot 🧟‍♀️")
    print("Type your survival questions and Apoca-AI will guide you. Type 'quit' to exit.\n")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'quit':
            print("Apoca-AI: Stay strong, survivor! May the zombies never catch you. 🧟‍♂️💪")
            break
        response = bot.get_response(user_input)
        print(f"Apoca AI: {response}")

if __name__ == "__main__":
    chatbot()