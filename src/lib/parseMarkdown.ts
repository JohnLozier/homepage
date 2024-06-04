import { LanguageFn } from "highlight.js";
import { Marked } from "marked";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import hljs from "highlight.js/lib/common";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import { markedHighlight } from "marked-highlight";
import php from "highlight.js/lib/languages/php";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";

const languages: Record<string, LanguageFn> = {
	"bash": bash,
	"c": c,
	"cpp": cpp,
	"css": css,
	"go": go,
	"java": java,
	"javascript": javascript,
	"typescript": typescript,
	"php": php,
	"python": python,
	"ruby": ruby,
	"rust": rust,
	"sql": sql,
	"swift": swift
};

hljs.registerLanguage("plaintext", plaintext);

Object.keys(languages).forEach(language => hljs.registerLanguage(language, languages[language]));

const ParseMarkdown = (markdown: string) =>
	new Marked(markedHighlight({
		langPrefix: "hljs language-",
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : "plaintext";
			return hljs.highlight(code, { language }).value;
		}
	})).parse(markdown) as string;

export default ParseMarkdown;