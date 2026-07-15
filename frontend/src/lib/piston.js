import { version } from "react"

// Using Judge0 API instead of Piston API because public Piston API is now whitelist-only
const JUDGE0_API = "https://ce.judge0.com";

const LANGUAGE_VERSIONS = {
    javascript: 93, // Node.js 18.15.0
    python: 92,     // Python 3.11.2
    java: 91,       // Java JDK 17.0.6
};

/**
 * 
 * @param {string} language - programming langauge
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>} 
 */

export async function executeCode(language, code) {
    try {
        const languageId = LANGUAGE_VERSIONS[language];

        if (!languageId) {
            return {
                success: false,
                error: `Unsupported language: ${language}`
            };
        }

        let sourceCode = code;
        if (language === "java") {
            // Judge0 expects the main class to be named 'Main'
            // We replace the first occurrence of 'public class X' or 'class X' with 'class Main'
            if (!sourceCode.includes("public class ")) {
                sourceCode = sourceCode.replace(/class\s+[a-zA-Z0-9_]+/, "class Main");
            } else {
                sourceCode = sourceCode.replace(/public\s+class\s+[a-zA-Z0-9_]+/, "public class Main");
            }
        }

        const response = await fetch(`${JUDGE0_API}/submissions?wait=true`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language_id: languageId,
                source_code: sourceCode,
            }),
        });

        if (!response.ok) {
            return {
                success: false,
                error: `HTTP error! status: ${response.status}`
            };
        }

        const data = await response.json();

        // judge0 returns output in stdout and errors in stderr or compile_output
        const output = data.stdout || "";
        const stderr = data.stderr || data.compile_output || "";

        if (stderr) {
            return {
                success: false,
                output: output,
                error: stderr
            };
        }

        return {
            success: true,
            output: output || "No output"
        };

    } catch (error) {
        return {
            success: false,
            error: `Failed to execute code: ${error.message}`,
        };
    }
}

function getFileExtension(language) {
    const extensions = {
        javascript: "js",
        python: "py",
        java: "java",
    };

    return extensions[language] || "txt";
}