export async function onRequest(context) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');
  const apiKey = env.GOOGLE_API_KEY;

  if (!placeId) return new Response("Missing ID", { status: 400 });

  // URL directa a la API de Places
  const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}&language=es`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Si Google nos responde con datos, los devolvemos
    if (data.status === "OK") {
      return new Response(JSON.stringify(data.result.reviews || []), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Esto soluciona bloqueos de CORS
        },
      });
    } else {
      // Si hay error, devolvemos un array vacío para no romper la web
      console.error("Error de Google:", data.status, data.error_message);
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (e) {
    return new Response(JSON.stringify([]), { status: 500 });
  }
}