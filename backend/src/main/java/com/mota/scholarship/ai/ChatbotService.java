package com.mota.scholarship.ai;

import com.mota.scholarship.scheme.SchemeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * AI Chatbot Service - provides intelligent Q&A about schemes and application status.
 * Uses OpenAI when OPENAI_API_KEY is configured; otherwise uses deterministic FAQ and scheme knowledge base.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotService {

    private final SchemeRepository schemeRepository;
    private final OpenAiService openAiService;

    private static final Map<String, String> FAQ_RESPONSES = Map.ofEntries(
            Map.entry("eligibility", "To be eligible for MoTA scholarships, you must be a member of a Scheduled Tribe (ST), studying in a recognized institution, and meet income criteria (family income below ₹2.5 lakh per annum for most schemes)."),
            Map.entry("document", "Required documents typically include: ST/SC Caste Certificate, Income Certificate, Previous Year Marksheet, Aadhaar Card, Bank Account details (with IFSC), and Institution Verification Certificate."),
            Map.entry("status", "To check your application status, go to Dashboard → My Applications. Each application shows the current stage: DRAFT → SUBMITTED → VERIFIED → APPROVED → SANCTIONED → DISBURSED."),
            Map.entry("deadline", "Application deadlines vary by scheme. Pre-Matric scholarships typically close in September; Post-Matric scholarships close in October–November. Check the scheme details page for exact dates."),
            Map.entry("income", "The maximum annual family income limit is ₹2,50,000 for most MoTA scholarship schemes. Some fellowship schemes may have different criteria."),
            Map.entry("renewal", "Scholarship renewal requires fresh application each year with updated income certificate and marksheet. You must maintain minimum 50% attendance and pass in all subjects."),
            Map.entry("grievance", "To file a grievance, go to Grievances → New Grievance. Provide your ticket number when following up. Our team responds within 5 working days."),
            Map.entry("digilocker", "DigiLocker integration allows auto-fetching of verified documents. Click 'Fetch from DigiLocker' on the document upload page and authorize with your Aadhaar-linked account."),
            Map.entry("bank", "Scholarship amounts are directly credited to your Aadhaar-linked bank account via DBT. Ensure your bank account is Aadhaar-linked and details are updated in your profile."),
            Map.entry("fellowship", "MoTA offers the National Fellowship for ST Students (formerly Rajiv Gandhi National Fellowship) for PhD and M.Phil. students. Apply through the fellowship tab in your dashboard."),
            Map.entry("overseas", "The National Overseas Scholarship provides financial assistance to ST students pursuing Master's degree or PhD abroad in top universities. Eligibility: below 35 years, family income below ₹6 lakh."),
            Map.entry("coaching", "The Pre-Examination Training Centres (PETC) scheme provides free coaching to ST students for competitive exams like UPSC, SSC, banking, and state PSC exams.")
    );

    public ChatbotDtos.ChatResponse processQuery(String query, String sessionId) {
        String lowerQuery = query.toLowerCase().trim();

        // 1. If OpenAI is configured, try querying OpenAI with MoTA context
        if (openAiService.isConfigured()) {
            try {
                String systemPrompt = "You are the official MoTA Scholarship Companion for the Ministry of Tribal Affairs (Government of India). " +
                        "Provide helpful, concise, and accurate guidance for Scheduled Tribe (ST) scholarship and fellowship schemes " +
                        "(Pre-Matric, Post-Matric, Top Class Education, NFST Fellowship, National Overseas Scholarship). " +
                        "Never fabricate rules or claim live integration without verification. Keep answers under 3-4 sentences.";
                String aiAnswer = openAiService.askQuestion(systemPrompt, query);
                if (aiAnswer != null && !aiAnswer.isBlank()) {
                    return ChatbotDtos.ChatResponse.builder()
                            .sessionId(sessionId)
                            .answer(aiAnswer)
                            .confidence(0.95)
                            .source("OPENAI_AI_ASSISTANT")
                            .suggestedActions(List.of("View Schemes", "Track Application", "Grievance Portal"))
                            .build();
                }
            } catch (Exception e) {
                log.warn("OpenAI call failed; falling back to knowledge base: {}", e.getMessage());
            }
        }

        // 2. Try FAQ keyword matching
        for (Map.Entry<String, String> entry : FAQ_RESPONSES.entrySet()) {
            if (lowerQuery.contains(entry.getKey())) {
                return ChatbotDtos.ChatResponse.builder()
                        .sessionId(sessionId)
                        .answer(entry.getValue())
                        .confidence(0.85)
                        .source("FAQ_KNOWLEDGE_BASE")
                        .suggestedActions(getSuggestedActions(entry.getKey()))
                        .build();
            }
        }

        // 3. Try scheme name matching
        String schemeAnswer = trySchemeMatch(lowerQuery);
        if (schemeAnswer != null) {
            return ChatbotDtos.ChatResponse.builder()
                    .sessionId(sessionId)
                    .answer(schemeAnswer)
                    .confidence(0.90)
                    .source("SCHEME_DATABASE")
                    .build();
        }

        // 4. Fallback response
        String fallbackAnswer = openAiService.isConfigured()
                ? "I can help you with information about MoTA scholarships and fellowships. You can ask me about eligibility, required documents, deadlines, and application status."
                : "AI assistance is currently operating in deterministic rules mode. I can help answer common questions about MoTA scholarships (Pre-Matric, Post-Matric, Top Class, NFST, NOS), required documents, income ceilings, and application tracking.";

        return ChatbotDtos.ChatResponse.builder()
                .sessionId(sessionId)
                .answer(fallbackAnswer)
                .confidence(0.60)
                .source(openAiService.isConfigured() ? "FALLBACK" : "DETERMINISTIC_RULES_ENGINE")
                .suggestedActions(List.of("Check Eligibility", "View Schemes", "File Grievance", "Track Application"))
                .build();
    }

    private String trySchemeMatch(String query) {
        if (query.contains("pre-matric") || query.contains("pre matric")) {
            return "The Pre-Matric Scholarship for ST students covers Classes 9 and 10. Benefits include: " +
                    "Day scholars get ₹3,500/year, Hostellers get ₹7,000/year. Family annual income must be below ₹2.5 lakh.";
        }
        if (query.contains("post-matric") || query.contains("post matric")) {
            return "The Post-Matric Scholarship covers Class 11 to PhD level. Maintenance allowance ranges " +
                    "up to ₹13,500/year depending on course group, plus full compulsory non-refundable fees reimbursed. Family income ceiling is ₹2.5 lakh per annum.";
        }
        if (query.contains("top class") || query.contains("premier")) {
            return "The Top Class Education Scheme covers meritorious ST students in premier institutions (IITs, IIMs, NITs, AIIMS, NLUs). " +
                    "Covers 100% tuition fee, ₹3,000/month living expense, ₹5,000/year book allowance, and ₹45,000 one-time computer grant. Income limit: ₹6.00 lakh/year.";
        }
        if (query.contains("national fellowship") || query.contains("nfst") || query.contains("phd") || query.contains("mphil")) {
            return "The National Fellowship for ST Students (NFST) supports M.Phil and Ph.D research scholars. " +
                    "JRF stipend: ₹37,000/month for first 2 years; SRF stipend: ₹42,000/month + HRA and ₹20,500/year contingency. No income ceiling.";
        }
        if (query.contains("overseas") || query.contains("nos") || query.contains("abroad")) {
            return "The National Overseas Scholarship (NOS) provides financial support to ST students for Master's and Ph.D in top 500 QS-ranked universities abroad. " +
                    "Covers full tuition, living maintenance ($15,400/year USA or £9,900/year UK), and economy airfare. Family income ceiling is ₹8.00 lakh.";
        }
        return null;
    }

    private List<String> getSuggestedActions(String topic) {
        return switch (topic) {
            case "eligibility" -> List.of("Check My Eligibility", "View Schemes", "Apply Now");
            case "document" -> List.of("Upload Documents", "Fetch from DigiLocker");
            case "status" -> List.of("Track My Application", "View Dashboard");
            case "grievance" -> List.of("File New Grievance", "Track Existing Grievance");
            default -> List.of("View Dashboard", "Browse Schemes");
        };
    }
}
