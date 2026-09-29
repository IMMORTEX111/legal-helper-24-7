export default {
  async fetch(request) {

    if (request.method !== "POST") {
      return Response.json(
        {
          success: false,
          error: "Method not allowed"
        },
        {
          status: 405
        }
      );
    }

    try {

      const body = await request.json();

      const category =
        typeof body.category === "string"
          ? body.category.trim()
          : "";

      const situation =
        typeof body.situation === "string"
          ? body.situation.trim()
          : "";

      const name =
        typeof body.name === "string"
          ? body.name.trim()
          : "";

      const contact =
        typeof body.contact === "string"
          ? body.contact.trim()
          : "";

      if (!category) {
        return Response.json(
          {
            success: false,
            error: "Не вибрана категорія."
          },
          {
            status: 400
          }
        );
      }

      if (!situation) {
        return Response.json(
          {
            success: false,
            error: "Не описана ситуація."
          },
          {
            status: 400
          }
        );
      }

      if (situation.length > 10000) {
        return Response.json(
          {
            success: false,
            error: "Опис ситуації занадто великий."
          },
          {
            status: 400
          }
        );
      }

      const supabaseUrl =
        process.env.SUPABASE_URL;

      const supabaseSecretKey =
        process.env.SUPABASE_SECRET_KEY;

      if (
        !supabaseUrl ||
        !supabaseSecretKey
      ) {
        console.error(
          "Supabase environment variables are missing."
        );

        return Response.json(
          {
            success: false,
            error: "Помилка конфігурації сервера."
          },
          {
            status: 500
          }
        );
      }

      const response =
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
              category,
              situation,
              name: name || null,
              contact: contact || null,
              status: "new"
            })
          }
        );

      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          "Supabase error:",
          errorText
        );

        return Response.json(
          {
            success: false,
            error: "Не вдалося зберегти звернення."
          },
          {
            status: 500
          }
        );
      }

      return Response.json(
        {
          success: true,
          message:
            "Звернення успішно збережено."
        },
        {
          status: 201
        }
      );

    } catch(error) {

      console.error(
        "API error:",
        error
      );

      return Response.json(
        {
          success: false,
          error:
            "Сталася помилка сервера."
        },
        {
          status: 500
        }
      );
    }
  }
};
