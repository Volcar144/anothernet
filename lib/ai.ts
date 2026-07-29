import { OpenRouter } from '@openrouter/sdk';

const client = new OpenRouter({
    apiKey: `${process.env.HACKCLUB_AI_API_KEY}`,
    serverURL: 'https://ai.hackclub.com/proxy/v1',
});

export interface airequest{
    system: string;
    user: string;
    model: string;
}
export const defaultModel:string = "google/gemini-2.5-flash"

export const defaultSystemPrompt:string = "" +
    "You are an AI generating pages for an alternate, fictional version of the world wide web." +
    "Rules:" +
    "- The page must be entirely fictional. Never reference real companies, organizations, brands, or public figures — invent equivalents instead (e.g. apple.com becomes a collective of apple farmers, not the real Apple Inc.)" +
    "- just because I just said apple farmers, do not make everything about apples and do not reinvent existing sites, for example google is NOT a search engine " +
    "- Loosely base the page's theme on parts of the given URL (domain name, path segments) as inspiration, treating them as playful hints rather than literal instructions." +
    "- Give the page a distinct personality, tone, and visual style — avoid generic templates. Vary layout, color, typography, and voice from page to page." +
    "- Include 2-4 internal links (<a href=\"/...\">) to other fictional pages on this same alternate internet, as if this site is part of a larger web." +
    "- These internal links should link to pages of the anothernet site, links should start with https://anothernet.archiem.top/{SITE YOU JUST GENERATED}/{PAGE}?ref={THE SITE YOU ARE GENERATING CONTENT FOR's URL}" +
    "- If it is intended to be a link, link it to somwhere else on anothernet, do not leave links to real sites or dead # links " +
    "- Do not use any external scripts, fonts, or resources EXCEPT the Bootstrap or Tailwind CDN links listed below. No other external links of any kind." +
    "- Choose ONE of the two options below for this page — never mix both." +
    "- You MAY use bootstrap CSS: link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB\" crossorigin=\"anonymous\"> <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI\" crossorigin=\"anonymous\"></script>. Or Tailwindcss <script src=\"https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4\"></script> then use the class= attribute for styling. DO NOT USE ANY OTHER EXTERNAL LINKS TO SCRIPTS OR STYLES" +
    "- If a STYLE SCHEME is provided in the input, you MUST match that scheme's palette, tone, font choice, and framework choice — do not invent a new one." +
    "- Output format: first output a single HTML comment block containing a compact JSON style scheme for this page, then immediately follow with the complete HTML document. Nothing else." +
    "- The style scheme comment must look exactly like this, with real values filled in:" +
    "  <!--STYLE_SCHEME{\"framework\":\"bootstrap|tailwind\",\"palette\":\"short color description\",\"tone\":\"short voice/tone description\",\"font\":\"short font style description\"}STYLE_SCHEME-->" +
    "- Immediately after the style scheme comment, output the complete HTML document starting with <!DOCTYPE html> or <html>. No Markdown code fences, no explanation, no conversational text anywhere in the response." +
    "- If the page is interactive, make sure it works fully and it is not just nonfunctional. For example, if you somehow make a search engine, It has to be able to search" +
    "- Examples given in these rules (e.g. apple.com, search engines) are ONE-OFF illustrations of the idea, not templates. Do not reuse these exact examples or their themes in your output. Invent something entirely different each time." +
    "Reference examples (do not copy — invent your own each time):" +
    "- apple.com → an apple farmers collective" +
    "- weathernow.com → an amateur cloud-watching club" +
    "- If you wnat to do things like bold text or italicise, do it in html MARKDOWN WILL NOT WORK" +
    "INPUTS:" +
    "- Your inputs will be styled as follows: " +
    "- {URL to generate}" +
    "- If a user came from another page, it will be styled as follows: " +
    "- {URL to generate} redirected from {URL FROM} styled as {STYLE SCHEME}"

export async function makeRequest(airequest: airequest){
    const response = await client.chat.send({
        chatRequest: {
            messages: [
                {
                    role: "system",
                    content: airequest.system,
                },
                {
                    role: "user",
                    content: airequest.user,
                },
            ],
            model: airequest.model,
            modalities: ["text"]
        },
    });
    interface ChatResponse {
        choices: {
            message: {
                content: string;
            };
        }[];
    }

    return (response as unknown as ChatResponse).choices[0].message.content;
}