```typescript
// ... (resto del código sin cambios)

const sendMessageToMarie = async (message: string) => {
  setIsLoading(true);

  // Agregar mensaje del usuario
  const userMessage: Message = {
    id: Date.now(),
    text: message,
    sender: "user",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputMessage("");

  try {
    const response = await fetch("https://isagis.app.n8n.cloud/webhook/c9b4472d-b7a4-439d-a2b2-fa88ece909d2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        timestamp: new Date().toISOString(),
        sessionId: `gear360hr_${Date.now()}`,
        source: "website_chat",
        user_info: {
          page: "homepage",
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();

      // Agregar respuesta de Marie
      const marieResponse: Message = {
        id: Date.now() + 1,
        text:
          data.chatOutput || // Busca chatOutput primero
          data.response ||
          data.message ||
          data.text ||
          "Gracias por tu mensaje. Un especialista de Gear360hr se pondrá en contacto contigo pronto.",
        sender: "marie",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, marieResponse]);
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error al enviar mensaje a Marie:", error);

    const errorMessage: Message = {
      id: Date.now() + 1,
      text: "Disculpa, estoy teniendo problemas técnicos. Contacta al 350-5795394 o contacto@gear360hr.com.",
      sender: "marie",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};

// ... (resto del código sin cambios)
```
