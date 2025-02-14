
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const fetchProductsFromSheet = async (sheetUrl: string): Promise<Product[]> => {
  try {
    // Extract the sheet ID from the URL
    const sheetId = sheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (!sheetId) {
      throw new Error("Invalid Google Sheet URL");
    }

    // Construct the Google Sheets API URL
    const apiUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    // Fetch the data
    const response = await fetch(apiUrl);
    const text = await response.text();
    const jsonString = text.match(/google\.visualization\.Query\.setResponse\((.*?)\);/)?.[1];
    
    if (!jsonString) {
      throw new Error("Failed to parse sheet data");
    }

    const data = JSON.parse(jsonString);
    const rows = data.table.rows;

    // Convert sheet data to products
    return rows.map((row: any, index: number) => ({
      id: (index + 1).toString(),
      name: row.c[0]?.v || "Untitled Product",
      price: parseFloat(row.c[1]?.v || "0"),
      description: row.c[2]?.v || "No description available",
      image: row.c[3]?.v || "/placeholder.svg",
    }));
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    throw error;
  }
};
