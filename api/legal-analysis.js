export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {

    const {
      category,
      situation,
      name,
      contact
    } = req.body || {};

    const cleanCategory =
      typeof category === "string"
        ? category.trim()
        : "";

    const cleanSituation =
      typeof situation === "string"
        ? situation.trim()
        : "";

    const cleanName =
      typeof name === "string"
        ? name.trim()
        : "";

    const cleanContact =
      typeof contact === "string"
        ? contact.trim()
        : "";


    if (!cleanCategory) {
      return res.status(400).json({
        success: false,
        error: "Не вибрана категорія."
      });
    }


    if (!cleanSituation) {
      return res.status(400).json({
        success: false,
        error: "Не описана ситуація."
      });
    }


    if (cleanSituation.length > 10000) {
      return res.status(400).json({
        success: false,
        error: "Опис ситуації занадто великий."
      });
    }


    const supabaseUrl =
      process.env.SUPABASE_URL;

    const supabaseSecretKey =
      process.env.SUPABASE_SECRET_KEY;


    if (!supabaseUrl || !supabaseSecretKey) {

      console.error(
        "Supabase environment variables are missing."
      );

      return res.status(500).json({
        success: false,
        error: "Помилка конфігурації сервера."
      });
    }


    const supabaseResponse =
      await fetch(
        `${supabaseUrl}/rest/v1/legal_requests`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseSecretKey,
            "Authorization":
              `Bearer ${supabaseSecretKey}`,
            "Prefer": "return=minimal"
          },

          body: JSON.stringify({

            category:
              cleanCategory,

            situation:
              cleanSituation,

            name:
              cleanName || null,

            contact:
              cleanContact || null,

            status:
              "new"

          })
        }
      );


    if (!supabaseResponse.ok) {

      const errorText =
        await supabaseResponse.text();

      console.error(
        "Supabase error:",
        errorText
      );

      return res.status(500).json({
        success: false,
        error:
          "Не вдалося зберегти звернення."
      });
    }


    return res.status(201).json({

      success: true,

      message:
        "Звернення успішно збережено."

    });


  } catch (error) {

    console.error(
      "API error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Сталася помилка сервера."
    });
  }
}
