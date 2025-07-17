#include <iostream>
#include <string>
#include <vector>
#include <regex>
#include <unordered_map>
#include <sstream>
#include <algorithm>
#include <memory>
#include <json/json.h>

class MarkdownRenderer {
private:
    std::unordered_map<std::string, std::string> htmlEntities;
    std::vector<std::pair<std::regex, std::string>> inlineRules;
    std::vector<std::pair<std::regex, std::function<std::string(const std::smatch&)>>> blockRules;
    
public:
    MarkdownRenderer() {
        initializeHtmlEntities();
        initializeInlineRules();
        initializeBlockRules();
    }
    
    void initializeHtmlEntities() {
        htmlEntities["&"] = "&amp;";
        htmlEntities["<"] = "&lt;";
        htmlEntities[">"] = "&gt;";
        htmlEntities["\""] = "&quot;";
        htmlEntities["'"] = "&#39;";
    }
    
    void initializeInlineRules() {
        inlineRules.push_back({std::regex(R"(\*\*([^*]+)\*\*)"), "<strong>$1</strong>"});
        inlineRules.push_back({std::regex(R"(__([^_]+)__)"), "<strong>$1</strong>"});
        inlineRules.push_back({std::regex(R"(\*([^*]+)\*)"), "<em>$1</em>"});
        inlineRules.push_back({std::regex(R"(_([^_]+)_)"), "<em>$1</em>"});
        inlineRules.push_back({std::regex(R"(~~([^~]+)~~)"), "<del>$1</del>"});
        inlineRules.push_back({std::regex(R"(`([^`]+)`)"), "<code>$1</code>"});
        inlineRules.push_back({std::regex(R"(\[([^\]]+)\]\(([^)]+)\))"), "<a href=\"$2\">$1</a>"});
        inlineRules.push_back({std::regex(R"(!\[([^\]]*)\]\(([^)]+)\))"), "<img src=\"$2\" alt=\"$1\">"});
        inlineRules.push_back({std::regex(R"((https?://[^\s]+))"), "<a href=\"$1\">$1</a>"});
        inlineRules.push_back({std::regex(R"(==([^=]+)==)"), "<mark>$1</mark>"});
        inlineRules.push_back({std::regex(R"(\^([^^]+)\^)"), "<sup>$1</sup>"});
        inlineRules.push_back({std::regex(R"(~([^~]+)~)"), "<sub>$1</sub>"});
    }
    
    void initializeBlockRules() {
        blockRules.push_back({
            std::regex(R"(^#{1,6}\s+(.+)$)"),
            [this](const std::smatch& match) {
                std::string content = match[1].str();
                int level = 0;
                for (char c : match[0].str()) {
                    if (c == '#') level++;
                    else break;
                }
                return "<h" + std::to_string(level) + ">" + processInline(content) + "</h" + std::to_string(level) + ">";
            }
        });
        
        blockRules.push_back({
            std::regex(R"(^>\s*(.+)$)"),
            [this](const std::smatch& match) {
                return "<blockquote>" + processInline(match[1].str()) + "</blockquote>";
            }
        });
        
        blockRules.push_back({
            std::regex(R"(^[-*+]\s+(.+)$)"),
            [this](const std::smatch& match) {
                return "<li>" + processInline(match[1].str()) + "</li>";
            }
        });
        
        blockRules.push_back({
            std::regex(R"(^\d+\.\s+(.+)$)"),
            [this](const std::smatch& match) {
                return "<li>" + processInline(match[1].str()) + "</li>";
            }
        });
        
        blockRules.push_back({
            std::regex(R"(^---+$|^\*\*\*+$|^___+$)"),
            [](const std::smatch& match) {
                return "<hr>";
            }
        });
    }
    
    std::string escapeHtml(const std::string& text) {
        std::string result = text;
        for (const auto& entity : htmlEntities) {
            size_t pos = 0;
            while ((pos = result.find(entity.first, pos)) != std::string::npos) {
                result.replace(pos, entity.first.length(), entity.second);
                pos += entity.second.length();
            }
        }
        return result;
    }
    
    std::string processInline(const std::string& text) {
        std::string result = escapeHtml(text);
        
        for (const auto& rule : inlineRules) {
            result = std::regex_replace(result, rule.first, rule.second);
        }
        
        return result;
    }
    
    std::string processCodeBlock(const std::vector<std::string>& lines, size_t& i) {
        std::string language = "";
        std::string firstLine = lines[i];
        
        if (firstLine.length() > 3) {
            language = firstLine.substr(3);
            language.erase(std::remove_if(language.begin(), language.end(), ::isspace), language.end());
        }
        
        std::ostringstream code;
        i++;
        
        while (i < lines.size() && lines[i] != "```") {
            code << escapeHtml(lines[i]) << "\n";
            i++;
        }
        
        std::string result = "<pre><code";
        if (!language.empty()) {
            result += " class=\"language-" + language + "\"";
        }
        result += ">" + code.str() + "</code></pre>";
        
        return result;
    }
    
    std::string processTable(const std::vector<std::string>& lines, size_t& i) {
        std::ostringstream table;
        table << "<table class=\"markdown-table\">";
        
        std::string headerLine = lines[i];
        std::vector<std::string> headers = splitTableRow(headerLine);
        
        table << "<thead><tr>";
        for (const auto& header : headers) {
            table << "<th>" << processInline(trim(header)) << "</th>";
        }
        table << "</tr></thead>";
        
        i++;
        if (i < lines.size() && isTableSeparator(lines[i])) {
            i++;
        }
        
        table << "<tbody>";
        while (i < lines.size() && isTableRow(lines[i])) {
            std::vector<std::string> cells = splitTableRow(lines[i]);
            table << "<tr>";
            for (const auto& cell : cells) {
                table << "<td>" << processInline(trim(cell)) << "</td>";
            }
            table << "</tr>";
            i++;
        }
        table << "</tbody></table>";
        
        i--;
        return table.str();
    }
    
    std::vector<std::string> splitTableRow(const std::string& row) {
        std::vector<std::string> cells;
        std::string cell;
        bool inEscape = false;
        
        for (size_t i = 0; i < row.length(); i++) {
            char c = row[i];
            if (c == '\\' && !inEscape) {
                inEscape = true;
                continue;
            }
            if (c == '|' && !inEscape) {
                if (!cell.empty() || !cells.empty()) {
                    cells.push_back(cell);
                    cell.clear();
                }
            } else {
                cell += c;
            }
            inEscape = false;
        }
        
        if (!cell.empty()) {
            cells.push_back(cell);
        }
        
        return cells;
    }
    
    bool isTableRow(const std::string& line) {
        return line.find('|') != std::string::npos;
    }
    
    bool isTableSeparator(const std::string& line) {
        std::regex separator(R"(^\s*\|?(\s*:?-+:?\s*\|)*\s*:?-+:?\s*\|?\s*$)");
        return std::regex_match(line, separator);
    }
    
    std::string trim(const std::string& str) {
        size_t start = str.find_first_not_of(" \t\r\n");
        if (start == std::string::npos) return "";
        size_t end = str.find_last_not_of(" \t\r\n");
        return str.substr(start, end - start + 1);
    }
    
    std::string processList(const std::vector<std::string>& lines, size_t& i, bool ordered) {
        std::ostringstream list;
        list << (ordered ? "<ol>" : "<ul>");
        
        std::regex listPattern = ordered ? 
            std::regex(R"(^\d+\.\s+(.+)$)") : 
            std::regex(R"(^[-*+]\s+(.+)$)");
        
        while (i < lines.size()) {
            std::smatch match;
            if (std::regex_match(lines[i], match, listPattern)) {
                list << "<li>" << processInline(match[1].str()) << "</li>";
                i++;
            } else if (lines[i].empty()) {
                i++;
                break;
            } else {
                break;
            }
        }
        
        list << (ordered ? "</ol>" : "</ul>");
        i--;
        return list.str();
    }
    
    std::string processTaskList(const std::vector<std::string>& lines, size_t& i) {
        std::ostringstream list;
        list << "<ul class=\"task-list\">";
        
        std::regex taskPattern(R"(^[-*+]\s+\[([ x])\]\s+(.+)$)");
        
        while (i < lines.size()) {
            std::smatch match;
            if (std::regex_match(lines[i], match, taskPattern)) {
                bool checked = match[1].str() == "x";
                std::string content = match[2].str();
                
                list << "<li class=\"task-list-item\">";
                list << "<input type=\"checkbox\" disabled" << (checked ? " checked" : "") << ">";
                list << processInline(content);
                list << "</li>";
                i++;
            } else if (lines[i].empty()) {
                i++;
                break;
            } else {
                break;
            }
        }
        
        list << "</ul>";
        i--;
        return list.str();
    }
    
    std::string render(const std::string& markdown) {
        std::istringstream stream(markdown);
        std::vector<std::string> lines;
        std::string line;
        
        while (std::getline(stream, line)) {
            lines.push_back(line);
        }
        
        std::ostringstream html;
        
        for (size_t i = 0; i < lines.size(); i++) {
            std::string currentLine = lines[i];
            
            if (currentLine.empty()) {
                continue;
            }
            
            if (currentLine.substr(0, 3) == "```") {
                html << processCodeBlock(lines, i);
                continue;
            }
            
            if (isTableRow(currentLine) && i + 1 < lines.size() && isTableSeparator(lines[i + 1])) {
                html << processTable(lines, i);
                continue;
            }
            
            std::regex taskListPattern(R"(^[-*+]\s+\[([ x])\]\s+.+$)");
            if (std::regex_match(currentLine, taskListPattern)) {
                html << processTaskList(lines, i);
                continue;
            }
            
            std::regex orderedListPattern(R"(^\d+\.\s+.+$)");
            if (std::regex_match(currentLine, orderedListPattern)) {
                html << processList(lines, i, true);
                continue;
            }
            
            std::regex unorderedListPattern(R"(^[-*+]\s+.+$)");
            if (std::regex_match(currentLine, unorderedListPattern)) {
                html << processList(lines, i, false);
                continue;
            }
            
            bool processed = false;
            for (const auto& rule : blockRules) {
                std::smatch match;
                if (std::regex_match(currentLine, match, rule.first)) {
                    html << rule.second(match);
                    processed = true;
                    break;
                }
            }
            
            if (!processed) {
                html << "<p>" << processInline(currentLine) << "</p>";
            }
        }
        
        return html.str();
    }
    
    Json::Value processRequest(const Json::Value& request) {
        Json::Value response;
        auto start = std::chrono::high_resolution_clock::now();
        
        try {
            std::string operation = request["operation"].asString();
            
            if (operation == "render_markdown") {
                std::string markdown = request["data"]["markdown"].asString();
                std::string options = request["data"]["options"].asString();
                
                std::string html = render(markdown);
                
                Json::Value result;
                result["html"] = html;
                result["length"] = static_cast<int>(html.length());
                result["lines"] = static_cast<int>(std::count(markdown.begin(), markdown.end(), '\n') + 1);
                
                response["success"] = true;
                response["result"] = result;
                
            } else if (operation == "validate_markdown") {
                std::string markdown = request["data"]["markdown"].asString();
                
                Json::Value result;
                result["valid"] = true;
                result["errors"] = Json::Value(Json::arrayValue);
                result["warnings"] = Json::Value(Json::arrayValue);
                
                response["success"] = true;
                response["result"] = result;
                
            } else if (operation == "extract_metadata") {
                std::string markdown = request["data"]["markdown"].asString();
                
                Json::Value metadata;
                metadata["headings"] = extractHeadings(markdown);
                metadata["links"] = extractLinks(markdown);
                metadata["images"] = extractImages(markdown);
                metadata["codeBlocks"] = extractCodeBlocks(markdown);
                
                Json::Value result;
                result["metadata"] = metadata;
                
                response["success"] = true;
                response["result"] = result;
                
            } else {
                response["success"] = false;
                response["error"] = "Unknown operation";
            }
            
        } catch (const std::exception& e) {
            response["success"] = false;
            response["error"] = e.what();
        }
        
        auto end = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
        response["executionTime"] = duration.count();
        
        return response;
    }
    
    Json::Value extractHeadings(const std::string& markdown) {
        Json::Value headings(Json::arrayValue);
        std::istringstream stream(markdown);
        std::string line;
        int lineNumber = 0;
        
        std::regex headingPattern(R"(^(#{1,6})\s+(.+)$)");
        
        while (std::getline(stream, line)) {
            lineNumber++;
            std::smatch match;
            if (std::regex_match(line, match, headingPattern)) {
                Json::Value heading;
                heading["level"] = static_cast<int>(match[1].str().length());
                heading["text"] = match[2].str();
                heading["line"] = lineNumber;
                headings.append(heading);
            }
        }
        
        return headings;
    }
    
    Json::Value extractLinks(const std::string& markdown) {
        Json::Value links(Json::arrayValue);
        std::regex linkPattern(R"(\[([^\]]+)\]\(([^)]+)\))");
        std::sregex_iterator iter(markdown.begin(), markdown.end(), linkPattern);
        std::sregex_iterator end;
        
        while (iter != end) {
            Json::Value link;
            link["text"] = (*iter)[1].str();
            link["url"] = (*iter)[2].str();
            links.append(link);
            ++iter;
        }
        
        return links;
    }
    
    Json::Value extractImages(const std::string& markdown) {
        Json::Value images(Json::arrayValue);
        std::regex imagePattern(R"(!\[([^\]]*)\]\(([^)]+)\))");
        std::sregex_iterator iter(markdown.begin(), markdown.end(), imagePattern);
        std::sregex_iterator end;
        
        while (iter != end) {
            Json::Value image;
            image["alt"] = (*iter)[1].str();
            image["src"] = (*iter)[2].str();
            images.append(image);
            ++iter;
        }
        
        return images;
    }
    
    Json::Value extractCodeBlocks(const std::string& markdown) {
        Json::Value codeBlocks(Json::arrayValue);
        std::istringstream stream(markdown);
        std::string line;
        bool inCodeBlock = false;
        std::string language;
        std::ostringstream codeContent;
        
        while (std::getline(stream, line)) {
            if (line.substr(0, 3) == "```") {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    language = line.length() > 3 ? line.substr(3) : "";
                    codeContent.str("");
                } else {
                    Json::Value codeBlock;
                    codeBlock["language"] = language;
                    codeBlock["code"] = codeContent.str();
                    codeBlocks.append(codeBlock);
                    inCodeBlock = false;
                }
            } else if (inCodeBlock) {
                codeContent << line << "\n";
            }
        }
        
        return codeBlocks;
    }
};

int main() {
    MarkdownRenderer renderer;
    std::string line;
    
    while (std::getline(std::cin, line)) {
        Json::Value request;
        Json::Reader reader;
        
        if (reader.parse(line, request)) {
            Json::Value response = renderer.processRequest(request);
            
            Json::StreamWriterBuilder builder;
            builder["indentation"] = "";
            std::unique_ptr<Json::StreamWriter> writer(builder.newStreamWriter());
            
            std::ostringstream oss;
            writer->write(response, &oss);
            std::cout << oss.str() << std::endl;
        }
    }
    
    return 0;
}
