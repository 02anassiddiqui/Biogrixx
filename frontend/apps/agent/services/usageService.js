import { supabase } from "../lib/supabase";

export const submitMeterReading = async (
  customerId,
  currentReading,
  imageFile,
) => {
  try {
    // 1. Upload Photo to Supabase Storage
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${customerId}-${Date.now()}.${fileExt}`;
    const filePath = `meter-readings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("biogrix-assets") // Bucket ka naam check kar lena
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    // 2. Get Public URL of the photo
    const {
      data: { publicUrl },
    } = supabase.storage.from("biogrix-assets").getPublicUrl(filePath);

    // 3. Call Backend API to save reading & generate bill
    // Hum direct Supabase use kar sakte hain ya apna Node.js API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/gas-usage/record`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          current_reading: currentReading,
          image_url: publicUrl,
        }),
      },
    );

    return await response.json();
  } catch (error) {
    console.error("Error in submission:", error);
    return { success: false, message: error.message };
  }
};
