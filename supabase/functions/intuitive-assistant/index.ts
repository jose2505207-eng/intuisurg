import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, workOrderId, orderNumber, conversationHistory } = await req.json();

    // Context for the AI assistant
    const systemContext = `You are an Intuitive Assistant for a Manufacturing Testing System. You help technicians with:
- Understanding work orders and manufacturing processes
- Troubleshooting test failures
- Explaining testing procedures and MPI (Manufacturing Process Instructions)
- Interpreting sensor readings and measurements
- Providing guidance on corrective actions
- Answering questions about BOM (Bill of Materials), sign-off operations, and process logs

Current context:
- Work Order: ${orderNumber}
- Work Order ID: ${workOrderId}

Be helpful, concise, and technical. Provide actionable advice when possible.`;

    // Build conversation for AI
    const messages = [
      { role: 'system', content: systemContext },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    // For now, return a simulated response
    // In production, you would integrate with OpenAI, Anthropic, or another AI service
    const simulatedResponse = generateSimulatedResponse(message, orderNumber);

    return new Response(
      JSON.stringify({ response: simulatedResponse }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error in intuitive-assistant:', error);
    return new Response(
      JSON.stringify({ error: error.message, response: 'I apologize, but I encountered an error processing your request.' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});

function generateSimulatedResponse(message: string, orderNumber: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('test') && (lowerMessage.includes('fail') || lowerMessage.includes('error'))) {
    return `For test failures on work order ${orderNumber}, I recommend the following steps:\n\n1. Review the failure codes in the Failure Analysis screen\n2. Check sensor readings - voltage should be between 220-240V, pressure above 50 PSI\n3. Review the Process Logs for any anomalies during testing\n4. Follow the recommended corrective instructions based on the failure analysis\n\nWould you like me to explain any specific failure code or sensor reading?`;
  }

  if (lowerMessage.includes('voltage') || lowerMessage.includes('pressure') || lowerMessage.includes('temperature')) {
    return `Regarding sensor readings:\n\n- **Voltage**: Normal range is 220-240V. Values above 240V trigger VOLT-HIGH failure.\n- **Pressure**: Must be above 50 PSI. Values below trigger PRESS-LOW failure.\n- **Temperature**: Should stay below 80°C during testing.\n\nCurrent readings can be monitored in real-time during the testing phase. Any anomalies will be flagged automatically.`;
  }

  if (lowerMessage.includes('bom') || lowerMessage.includes('bill of materials')) {
    return `The Bill of Materials (BOM) for work order ${orderNumber} contains all components used in this unit, including:\n\n- Part numbers\n- Reference designations\n- Serial/tracking IDs for traceability\n\nYou can access the BOM at any time using the BOM button in the navigation bar. This ensures full traceability of all components used in manufacturing.`;
  }

  if (lowerMessage.includes('sign') || lowerMessage.includes('signoff')) {
    return `Sign-off operations track which technicians completed each manufacturing step for work order ${orderNumber}. This provides:\n\n- Full accountability and traceability\n- Quality control verification\n- Compliance documentation\n\nEach operation is automatically logged with the technician's name and timestamp when completed.`;
  }

  if (lowerMessage.includes('rework') || lowerMessage.includes('corrective')) {
    return `When a test fails, our system analyzes the failure and recommends corrective actions by:\n\n1. Matching failure codes with historical process logs\n2. Calculating similarity scores based on symptoms\n3. Ranking solutions by success rate\n\nEach recommended action includes detailed Manufacturing Process Instructions (MPI) to guide you through the rework process step by step.`;
  }

  if (lowerMessage.includes('mpi') || lowerMessage.includes('instruction')) {
    return `Manufacturing Process Instructions (MPIs) provide step-by-step guidance for:\n\n- Setup procedures before testing\n- Corrective actions for failures\n- Rework operations\n\nEach MPI includes detailed instructions and safety protocols. Follow each step carefully and use the navigation buttons to move through the process.`;
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return `Hello! I'm here to assist you with work order ${orderNumber}. I can help with:\n\n- Explaining test results and failure codes\n- Troubleshooting sensor readings\n- Understanding MPIs and procedures\n- Navigating the system\n- Answering questions about BOM, sign-offs, and process logs\n\nWhat would you like to know?`;
  }

  // Default response
  return `I'm here to help with work order ${orderNumber}. I can assist you with:\n\n- Test procedures and troubleshooting\n- Understanding failure codes and corrective actions\n- Sensor readings and specifications\n- Bill of Materials and component tracking\n- Sign-off operations and process logs\n\nCould you provide more details about what you need help with?`;
}