/**
 * Helper functions for interacting with the AI Assistant globally
 */

/**
 * Activates the AI Assistant with an optional initial message
 */
export const toggleAIAssistant = (initialMessage?: string) => {
  // Create and dispatch a custom event that the AIAssistant component will listen for
  const event = new CustomEvent('openAIAssistant', { 
    detail: { initialMessage } 
  });
  window.dispatchEvent(event);
};

/**
 * Closes the AI Assistant
 */
export const closeAIAssistant = () => {
  const event = new CustomEvent('closeAIAssistant');
  window.dispatchEvent(event);
};

/**
 * Sends a message to the AI Assistant
 */
export const sendMessageToAIAssistant = (message: string) => {
  const event = new CustomEvent('sendToAIAssistant', {
    detail: { message }
  });
  window.dispatchEvent(event);
}; 