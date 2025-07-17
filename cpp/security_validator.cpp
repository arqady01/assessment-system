#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <regex>
#include <chrono>
#include <openssl/evp.h>
#include <openssl/aes.h>
#include <openssl/rand.h>
#include <openssl/sha.h>
#include <openssl/rsa.h>
#include <openssl/pem.h>
#include <json/json.h>

class SecurityValidator {
private:
    std::map<std::string, std::vector<std::regex>> validationRules;
    
public:
    SecurityValidator() {
        initializeRules();
    }
    
    void initializeRules() {
        validationRules["no_sql_injection"] = {
            std::regex(R"(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)", std::regex_constants::icase),
            std::regex(R"((\-\-)|(\#)|(/\*)|(\*/)|(\bor\b)|(\band\b))", std::regex_constants::icase),
            std::regex(R"(\b(script|javascript|vbscript)\b)", std::regex_constants::icase)
        };
        
        validationRules["no_xss"] = {
            std::regex(R"(<script[^>]*>.*?</script>)", std::regex_constants::icase),
            std::regex(R"(javascript:)", std::regex_constants::icase),
            std::regex(R"(on\w+\s*=)", std::regex_constants::icase),
            std::regex(R"(<iframe[^>]*>)", std::regex_constants::icase)
        };
        
        validationRules["no_command_injection"] = {
            std::regex(R"(\b(rm|del|format|shutdown|reboot|kill|ps|ls|dir|cat|type)\b)", std::regex_constants::icase),
            std::regex(R"([\|\&\;\`\$\(\)\{\}\[\]])"),
            std::regex(R"(\.\./)"),
            std::regex(R"(/etc/|/proc/|/sys/)")
        };
        
        validationRules["no_path_traversal"] = {
            std::regex(R"(\.\./|\.\.\)"),
            std::regex(R"(^/|^[a-zA-Z]:\\)"),
            std::regex(R"([\<\>\:\"\|\?\*])"),
            std::regex(R"(\0)")
        };
    }
    
    Json::Value validateInput(const std::string& input, const std::vector<std::string>& rules) {
        Json::Value result;
        std::vector<std::string> threats;
        bool isValid = true;
        
        for (const auto& rule : rules) {
            if (validationRules.find(rule) != validationRules.end()) {
                for (const auto& regex : validationRules[rule]) {
                    if (std::regex_search(input, regex)) {
                        threats.push_back(rule);
                        isValid = false;
                        break;
                    }
                }
            }
        }
        
        result["valid"] = isValid;
        Json::Value threatArray(Json::arrayValue);
        for (const auto& threat : threats) {
            threatArray.append(threat);
        }
        result["threats"] = threatArray;
        
        return result;
    }
    
    std::string encryptAES256(const std::string& plaintext, const std::string& key) {
        EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
        unsigned char iv[16];
        RAND_bytes(iv, 16);
        
        EVP_EncryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL);
        EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_IVLEN, 16, NULL);
        EVP_EncryptInit_ex(ctx, NULL, NULL, (unsigned char*)key.c_str(), iv);
        
        unsigned char ciphertext[plaintext.length() + 16];
        int len;
        int ciphertext_len;
        
        EVP_EncryptUpdate(ctx, ciphertext, &len, (unsigned char*)plaintext.c_str(), plaintext.length());
        ciphertext_len = len;
        
        EVP_EncryptFinal_ex(ctx, ciphertext + len, &len);
        ciphertext_len += len;
        
        unsigned char tag[16];
        EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_GET_TAG, 16, tag);
        
        EVP_CIPHER_CTX_free(ctx);
        
        std::string result;
        for (int i = 0; i < 16; i++) {
            result += iv[i];
        }
        for (int i = 0; i < ciphertext_len; i++) {
            result += ciphertext[i];
        }
        for (int i = 0; i < 16; i++) {
            result += tag[i];
        }
        
        return result;
    }
    
    std::string decryptAES256(const std::string& ciphertext, const std::string& key) {
        if (ciphertext.length() < 32) return "";
        
        unsigned char iv[16];
        unsigned char tag[16];
        
        for (int i = 0; i < 16; i++) {
            iv[i] = ciphertext[i];
            tag[i] = ciphertext[ciphertext.length() - 16 + i];
        }
        
        std::string encrypted_data = ciphertext.substr(16, ciphertext.length() - 32);
        
        EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
        EVP_DecryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL);
        EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_IVLEN, 16, NULL);
        EVP_DecryptInit_ex(ctx, NULL, NULL, (unsigned char*)key.c_str(), iv);
        
        unsigned char plaintext[encrypted_data.length()];
        int len;
        int plaintext_len;
        
        EVP_DecryptUpdate(ctx, plaintext, &len, (unsigned char*)encrypted_data.c_str(), encrypted_data.length());
        plaintext_len = len;
        
        EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_TAG, 16, tag);
        
        int ret = EVP_DecryptFinal_ex(ctx, plaintext + len, &len);
        EVP_CIPHER_CTX_free(ctx);
        
        if (ret > 0) {
            plaintext_len += len;
            return std::string((char*)plaintext, plaintext_len);
        }
        
        return "";
    }
    
    std::string generateSHA256(const std::string& input) {
        unsigned char hash[SHA256_DIGEST_LENGTH];
        SHA256_CTX sha256;
        SHA256_Init(&sha256);
        SHA256_Update(&sha256, input.c_str(), input.length());
        SHA256_Final(hash, &sha256);
        
        std::string result;
        for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
            char hex[3];
            sprintf(hex, "%02x", hash[i]);
            result += hex;
        }
        
        return result;
    }
    
    std::string generateSecureToken(int length) {
        unsigned char buffer[length];
        RAND_bytes(buffer, length);
        
        std::string result;
        for (int i = 0; i < length; i++) {
            char hex[3];
            sprintf(hex, "%02x", buffer[i]);
            result += hex;
        }
        
        return result;
    }
    
    Json::Value performSecurityScan(const Json::Value& data) {
        Json::Value result;
        std::vector<std::string> issues;
        bool isSafe = true;
        
        if (data.isString()) {
            std::string str = data.asString();
            
            if (str.find("<script") != std::string::npos) {
                issues.push_back("Potential XSS script tag detected");
                isSafe = false;
            }
            
            if (str.find("javascript:") != std::string::npos) {
                issues.push_back("JavaScript URL detected");
                isSafe = false;
            }
            
            if (std::regex_search(str, std::regex(R"(\b(select|union|insert|delete)\b)", std::regex_constants::icase))) {
                issues.push_back("Potential SQL injection detected");
                isSafe = false;
            }
            
            if (str.find("../") != std::string::npos || str.find("..\\") != std::string::npos) {
                issues.push_back("Path traversal attempt detected");
                isSafe = false;
            }
        }
        
        result["safe"] = isSafe;
        Json::Value issueArray(Json::arrayValue);
        for (const auto& issue : issues) {
            issueArray.append(issue);
        }
        result["issues"] = issueArray;
        
        return result;
    }
    
    bool validateCredentials(const std::string& username, const std::string& passwordHash, const std::string& salt) {
        if (username.empty() || passwordHash.empty() || salt.empty()) {
            return false;
        }
        
        if (username.length() > 255 || passwordHash.length() != 64 || salt.length() < 16) {
            return false;
        }
        
        std::regex usernamePattern("^[a-zA-Z0-9_.-]+$");
        if (!std::regex_match(username, usernamePattern)) {
            return false;
        }
        
        std::regex hashPattern("^[a-fA-F0-9]{64}$");
        if (!std::regex_match(passwordHash, hashPattern)) {
            return false;
        }
        
        return true;
    }
    
    Json::Value processRequest(const Json::Value& request) {
        Json::Value response;
        auto start = std::chrono::high_resolution_clock::now();
        
        try {
            std::string operation = request["operation"].asString();
            
            if (operation == "validate_credentials") {
                Json::Value data = request["data"];
                bool valid = validateCredentials(
                    data["username"].asString(),
                    data["passwordHash"].asString(),
                    data["salt"].asString()
                );
                
                Json::Value result;
                result["valid"] = valid;
                response["success"] = true;
                response["result"] = result;
                
            } else if (operation == "input_validation") {
                Json::Value data = request["data"];
                std::string input = data["input"].asString();
                std::vector<std::string> rules;
                
                for (const auto& rule : data["rules"]) {
                    rules.push_back(rule.asString());
                }
                
                response["success"] = true;
                response["result"] = validateInput(input, rules);
                
            } else if (operation == "crypto_operation") {
                Json::Value data = request["data"];
                std::string type = data["type"].asString();
                Json::Value result;
                
                if (type == "encrypt") {
                    result["encrypted"] = encryptAES256(data["data"].asString(), data["key"].asString());
                } else if (type == "decrypt") {
                    result["decrypted"] = decryptAES256(data["data"].asString(), data["key"].asString());
                } else if (type == "hash") {
                    result["hash"] = generateSHA256(data["data"].asString());
                }
                
                response["success"] = true;
                response["result"] = result;
                
            } else if (operation == "generate_token") {
                Json::Value data = request["data"];
                int length = data["length"].asInt();
                
                Json::Value result;
                result["token"] = generateSecureToken(length);
                response["success"] = true;
                response["result"] = result;
                
            } else if (operation == "security_scan") {
                Json::Value data = request["data"];
                response["success"] = true;
                response["result"] = performSecurityScan(data);
                
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
};

int main() {
    SecurityValidator validator;
    std::string line;
    
    while (std::getline(std::cin, line)) {
        Json::Value request;
        Json::Reader reader;
        
        if (reader.parse(line, request)) {
            Json::Value response = validator.processRequest(request);
            
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
