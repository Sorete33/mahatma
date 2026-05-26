exports.handler = async (event) => {
  const { placeId } = event.queryStringParameters;
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!placeId) return { statusCode: 400, body: 'Missing placeId' };

  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=reviews&key=${apiKey}&languageCode=es`;
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.reviews || [])
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed fetching' }) };
  }
};