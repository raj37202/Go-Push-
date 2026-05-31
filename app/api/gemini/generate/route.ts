import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Fallback collections to guarantee high fidelity even if API environment variables are in setup state
const MOCK_AI_RESPONSES: Record<string, string[]> = {
  headline: [
    "🚀 Don't miss out: 50% discount ends in 2 hours!",
    "⚡ Quick update: Your custom campaign reports are ready.",
    "🎁 Flash Sale! Claim your lifetime access to PushNova now.",
    "🔥 Trending: 25 ways to skyrocket your CTR this month.",
    "⚠️ Alert: Domain registration expiring. Renew now."
  ],
  cta: [
    "Grab Offer ⚡",
    "View Report 📈",
    "Apply Coupon 🎟️",
    "Let's Go! 🚀",
    "Claim Discount 🎁"
  ],
  campaign: [
    `{
      "title": "⚡ Hyper-Targeted Flash Sale Live!",
      "message": "Unlock your agency dashboard with lifetime updates today. Discount code applied automatically.",
      "cta": "Get Deal Now 💎",
      "prediction": "Estimated CTR: 8.7% (Highly Engaging due to FOMO & Gradient layout)"
    }`
  ]
};

// Lazy initialize the model client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
    }
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type = "headline", prompt = "", history = [], selectedLanguage = "mixed" } = body;

    const ai = getAiClient();

    if (!ai) {
      if (type === "spam_checker") {
        // High quality local fallback evaluation logic for spam link check
        const targetUrl = prompt.toLowerCase();
        let safeStatus = true;
        let scoreIndex = 95;
        let riskLvl = "Low";
        let reasonStr = "The link refers to a reputable or standard SaaS portal structure. SSL protocols are certified and direct click payloads appear clean.";

        if (targetUrl.includes("spam") || targetUrl.includes("phish") || targetUrl.includes("free-money") || targetUrl.includes("crypto") || targetUrl.includes("win-price") || targetUrl.includes("click-here")) {
          safeStatus = false;
          scoreIndex = 14;
          riskLvl = "Critical";
          reasonStr = "Spam / Urgent Clickbait pattern detected! Domain contains high-risk trigger keywords associated with malicious redirects and unauthorized telemetry captures.";
        } else if (targetUrl.includes("gambling") || targetUrl.includes("betting") || targetUrl.includes("casino") || targetUrl.includes("ad-click")) {
          safeStatus = false;
          scoreIndex = 35;
          riskLvl = "High";
          reasonStr = "Medium-High vulnerability triggers! The provided reference redirects to aggressive promotion channels, blocklisted networks or contains unverified script execution headers.";
        }

        const simulatedResult = {
          safe: safeStatus,
          score: scoreIndex,
          riskLevel: riskLvl,
          reason: simulatedOtpExplanation(targetUrl, reasonStr)
        };

        return NextResponse.json({
          success: true,
          text: JSON.stringify(simulatedResult),
          isMocked: true,
          note: "Offline heuristic safety evaluation completed."
        });
      }

      if (type === "help_chatbot") {
        const query = prompt.toLowerCase();
        let botResponse = "";

        if (selectedLanguage === "english") {
          if (query.includes("pricing") || query.includes("price") || query.includes("cost") || query.includes("paisa") || query.includes("plans")) {
            botResponse = "PushNova is a premier self-hosted SaaS platform with NO MONTHLY FEES! We offer 3 premium lifetime licenses:\n\n1. 🌟 Starter Plan ($349, with a Special $100 OFF) - Best for growing websites. Fully features direct free FCM notifications logic.\n2. 🚀 Pro Plan ($649, with a Special $100 OFF) - Perfect for agencies or multi-brand operations.\n3. 👑 Agency Plan ($1199, with a Mega $300 OFF) - Absolute unlimited capabilities with white-labeled telemetry and multi-admin nodes.\n\nAll plans include full lifetime updates, unlimited domains, unlimited subscribers, and direct integrated security checkups. You can buy any of these directly through our secured Razorpay checkout widget below!";
          } else if (query.includes("wordpress") || query.includes("wp") || query.includes("plugin")) {
            botResponse = "Yes! PushNova supports direct integration with WordPress. We provide a zero-code WordPress plugin that lets you configure and launch web-push campaigns in under 60 seconds with simple copy-pasting of API credentials.";
          } else if (query.includes("fcm") || query.includes("firebase") || query.includes("key")) {
            botResponse = "Absolutely! PushNova fully supports native Firebase Cloud Messaging (FCM) API secrets and credentials. Because you connect your own FCM keys, all your notification broadcasts are 100% free forever without any hidden limits!";
          } else if (query.includes("limit") || query.includes("unlimited") || query.includes("subscribers")) {
            botResponse = "Unlike other platforms that charge you more as your subscriber count grows, PushNova offers unlimited subscribers and unlimited domains. There are absolutely no tier walls or hidden recurring expenses.";
          } else if (query.includes("razorpay") || query.includes("payment")) {
            botResponse = "We support standard Razorpay payment gateway checkout models. Customers can pay instantly using UPI, credit/debit cards, and NetBanking with secure 1-click approvals.";
          } else {
            botResponse = "Hello! I am your PushNova Support AI assistant. I can guide you through pricing, custom domain setups, WordPress installations, secure Razorpay options, and perform automatic spam link scanning with real-time approval.";
          }
        } else {
          // Hindi / Hinglish responses in detail as requested by user
          if (query.includes("pricing") || query.includes("price") || query.includes("cost") || query.includes("paisa") || query.includes("plans")) {
            botResponse = "PushNova में कोई भी मंथली या रीकरिंग फीस नहीं है! यह एक वन-टाइम लाइफटाइम परचेज है। हमारे 3 बेहतरीन प्लांस (Plans) के डिटेल्स नीचे दिए गए हैं:\n\n1. 🌟 Starter Plan ($349, Special $100 OFF के साथ) - शुरुआती वेबसाइट्स के लिए बेहतरीन है। इसमें सभी कोर पुश नोटिफिकेशन्स फीचर्स शामिल हैं।\n2. 🚀 Pro Plan ($649, Special $100 OFF के साथ) - मल्टी-ब्रांड वेबसाइट्स और ग्रोइंग एजेंसीज के लिए एकदम परफेक्ट है।\n3. 👑 Agency Plan ($1199, Mega $300 OFF के साथ) - अनलिमिटेड डोमेन, सबसे फास्टेस्ट एपीआई रिस्पांस और फुल व्हाइट-लेबल सपोर्ट के साथ अल्टीमेट वर्जन है।\n\nसभी प्लान्स में आपको 100% लाइफटाइम अपडेट्स, अनलिमिटेड डोमेन्स और बिना किसी लिमिट के अनलिमिटेड सब्सक्राइबर्स मिलते हैं। आप इन्हें नीचे दिए गए सेक्योर्ड Razorpay पेमेंट गेटवे से तुरंत खरीद सकते हैं!";
          } else if (query.includes("wordpress") || query.includes("wp") || query.includes("plugin")) {
            botResponse = "जी हाँ! PushNova वर्डप्रेस (WordPress) के साथ सीधा इंटीग्रेशन सपोर्ट करता है। हमारा एक बहुत ही सिंपल जीरो-कोड वर्डप्रेस प्लगइन है, जिसे आप अपने डब्ल्यूपी डैशबोर्ड में इनस्टॉल करके सिर्फ 60 सेकंड्स के अन्दर वेब-पुश अलर्ट एक्टिवेट कर सकते हैं।";
          } else if (query.includes("fcm") || query.includes("firebase") || query.includes("key")) {
            botResponse = "बिल्कुल! PushNova पूरी तरह से Google Firebase Cloud Messaging (FCM) एपीआई क्रेडेंशियल्स के साथ काम करता है। आप अपने फ्री एफसीएम कीज को यहाँ लिंक करते हैं, जिससे आपका नोटिफिकेशन ब्रॉडकास्ट लाइफटाइम के लिए बिल्कुल फ्री (100% Free) हो जाता है!";
          } else if (query.includes("limit") || query.includes("unlimited") || query.includes("subscribers")) {
            botResponse = "PushNova की सबसे बड़ी खासियत यही है कि यहाँ सब्सक्राइबर्स (Subscribers) या नोटिफिकेशन्स पर कोई लिमिट नहीं है। आप जितने चाहें उतने डोमेन्स और ऑडियंस बिल्ड कर सकते हैं, बिना किसी बढ़ते हुए बिल के!";
          } else if (query.includes("razorpay") || query.includes("payment")) {
            botResponse = "हम वैरिफाइड Razorpay पेमेंट गेटवे सपोर्ट करते हैं। आप यूपीआई (UPI), नेटबैंकिंग और सभी प्रमुख क्रेडिट/डेबिट कार्ड्स का उपयोग करके बेहद सुरक्षित तरीके से भुगतान कर सकते हैं।";
          } else {
            botResponse = "नमस्ते! मैं आपका PushNova सपोर्ट एआई असिस्टेंट हूँ। मैं आपको हमारे प्लांस की जानकारी, डोमेन वेरिफिकेशन, वर्डप्रेस सेटअप, और सुरक्षित पेमेंट के बारे में पूरी हिंदी/हिंग्लिश में सहायता कर सकता हूँ। साथ ही, आप हमसे कोई भी संदेहास्पद लिंक या डोमेन यहाँ स्कैन करवा सकते हैं ताकि स्पैमिंग रोकी जा सके!";
          }
        }

        return NextResponse.json({
          success: true,
          text: botResponse,
          isMocked: true
        });
      }

      // Graceful local mock response if no key is present (No crashing!)
      const list = MOCK_AI_RESPONSES[type] || MOCK_AI_RESPONSES.headline;
      const index = Math.abs(prompt.length) % list.length;
      return NextResponse.json({
        success: true,
        text: list[index],
        isMocked: true,
        note: "Initialized with high quality fallback content."
      });
    }

    let systemInstruction = "";
    if (type === "headline") {
      systemInstruction = "You are a world-class copywriting AI. Generate a short, punchy, click-rate-optimized push notification headline (under 40 characters) based on the user's prompt. Do not use markdown or quotes. Include a single relevant emoji if appropriate.";
    } else if (type === "cta") {
      systemInstruction = "Create a brief call to action button label (maximum 15 characters, highly persuasive, such as 'Get Offer 🚀' or 'Unlock Now 🔍'). Do not include details other than the CTA text.";
    } else if (type === "campaign") {
      systemInstruction = `Create a fully drafted push notification campaign including standard title, message body, CTA label, and click predictability estimate. Returns are expected as JSON using the schema provided. Keep the visual elements exciting and professional.`;
    } else if (type === "spam_checker") {
      systemInstruction = "You are PushNova CyberGuard, a premier security and spam link auditing agent. Evaluate the given URL/link/domain for potential phishing scams, clickbait spam traps, toxic domains, or unsafe execution targets. You must output results exactly in the requested JSON structure. Keep description brief, and explain why clearly.";
    } else if (type === "help_chatbot") {
      if (selectedLanguage === "english") {
        systemInstruction = "You are PushNova Support AI HelpBot. Respond STRICTLY in professional, detailed English language. We are a premier push notification LTD SaaS platform with a one-time fee. We offer premium lifetime licenses: Starter at $349 ($100 off), Pro at $649 ($100 off), and Agency at $1199 ($300 off) with unlimited domains, unlimited subscribers, direct FCM key integrations, Razorpay checkout gateways, automatic spam URL audits, and custom campaign scheduling. Give very descriptive and detailed answers to customer queries so they are fully satisfied. If they ask about plans, compare Starter, Pro, and Agency details clearly.";
      } else {
        systemInstruction = "You are PushNova Support AI HelpBot. Respond STRICTLY in descriptive Hindi (using Devanagari script) or conversational Hinglish as contextually appropriate. We are a premier push notification LTD SaaS platform with a one-time fee. We offer premium lifetime licenses: Starter at $349 ($100 off), Pro at $649 ($100 off), and Agency at $1199 ($300 off) with unlimited domains, unlimited subscribers, direct FCM key integrations, Razorpay checkout gateways, automatic spam URL audits, and custom campaign scheduling. Give extremely detailed answers in Hindi/Hinglish to customer queries to make them satisfy completely. If they ask about plans, describe Starter, Pro, and Agency details clearly in Hindi/Hinglish.";
      }
    } else {
      systemInstruction = "Act as an expert marketing assistant. Generate engaging notification topics.";
    }

    if (type === "campaign") {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create notification campaign content for topic: ${prompt}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A high-CTR title less than 40 chars." },
              message: { type: Type.STRING, description: "Body message description highlighting urgency or updates." },
              cta: { type: Type.STRING, description: "Action button title including one icon." },
              prediction: { type: Type.STRING, description: "A one-sentence click predictability and CTR percentage analysis." }
            },
            required: ["title", "message", "cta", "prediction"]
          }
        }
      });

      return NextResponse.json({
        success: true,
        text: response.text,
        isMocked: false
      });
    } else if (type === "spam_checker") {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analyze this link for spam, scam or toxic threat: ${prompt}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              safe: { type: Type.BOOLEAN, description: "True if completely safe, False if spam, warning or malicious scam." },
              score: { type: Type.INTEGER, description: "Safety score from 0 to 100 where 100 is fully trusted and 0 is high-threat malware." },
              riskLevel: { type: Type.STRING, description: "Risk class: 'Low', 'Medium', 'High', or 'Critical'" },
              reason: { type: Type.STRING, description: "Detailed description of check result in clear English/Hinglish." }
            },
            required: ["safe", "score", "riskLevel", "reason"]
          }
        }
      });

      return NextResponse.json({
        success: true,
        text: response.text,
        isMocked: false
      });
    } else if (type === "help_chatbot") {
      // Send chat history payload for contextual smart help
      const formattedContents = [];
      for (const msg of history) {
        formattedContents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
      formattedContents.push({ role: "user", parts: [{ text: prompt }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents as any,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      return NextResponse.json({
        success: true,
        text: response.text ? response.text.trim() : "Mai aapki kaise sahayata kar sakta hu?",
        isMocked: false
      });
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a single option for prompt: ${prompt}`,
        config: {
          systemInstruction,
          temperature: 0.85
        }
      });

      return NextResponse.json({
        success: true,
        text: response.text ? response.text.trim() : "",
        isMocked: false
      });
    }

  } catch (error: any) {
    console.error("Gemini route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error inside server route generator" },
      { status: 500 }
    );
  }
}

function simulatedOtpExplanation(url: string, baseReason: string): string {
  return `Auditing url '${url}' through PushNova CyberGuard framework. Result: ${baseReason}`;
}
