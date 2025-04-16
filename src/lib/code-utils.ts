
type Message = {
  role: string;
  content: string;
};

export function extractCodeFromMessages(messages: Message[]): string {
  // Only look at assistant messages
  const assistantMessages = messages.filter(msg => msg.role === "assistant");
  
  if (assistantMessages.length === 0) {
    return "";
  }
  
  // Extract code blocks from all assistant messages
  let allCode = "";
  
  for (const message of assistantMessages) {
    const codeBlockRegex = /```(?:jsx?|tsx?|html|css)?\n([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(message.content)) !== null) {
      allCode += match[1] + "\n\n";
    }
  }
  
  return allCode.trim();
}
