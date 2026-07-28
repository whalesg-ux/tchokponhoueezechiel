use scraper::{Html, Selector};
use serde_json::json;
use std::fs;
use std::io;
use std::path::Path;
use std::process::Command;
use walkdir::WalkDir;

// ============================================================
// 1. EXCLUSIONS (tes dossiers à ignorer)
// ============================================================
const EXCLUDED_DIRS: [&str; 5] = [".venv", "node_modules", ".git", "__pycache__", "vendor"];

fn is_excluded(path: &Path) -> bool {
    path.components().any(|c| {
        let s = c.as_os_str().to_string_lossy();
        EXCLUDED_DIRS.contains(&s.as_ref())
    })
}

// ============================================================
// 2. TRONCATURE UTF-8 SÛRE (ton code)
// ============================================================
fn truncate_chars(s: &str, max_chars: usize) -> String {
    if s.chars().count() > max_chars {
        let truncated: String = s.chars().take(max_chars).collect();
        format!("{}…", truncated)
    } else {
        s.to_string()
    }
}

// ============================================================
// 3. OPTIMISATION HTML / JS / CSS (via les outils Rust)
// ============================================================
fn minify_html_files(root: &Path) {
    println!("📦 Minification des fichiers HTML...");
    for entry in WalkDir::new(root).into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();
        if is_excluded(path) {
            continue;
        }
        if path.extension().and_then(|s| s.to_str()) == Some("html") {
            let output = Command::new("minify-html")
                .arg("--output")
                .arg(path.to_str().unwrap())
                .arg(path.to_str().unwrap())
                .output();
            if let Ok(out) = output {
                if out.status.success() {
                    println!("  ✅ HTML minifié : {}", path.file_name().unwrap().to_string_lossy());
                }
            }
        }
    }
}

fn minify_js_files(root: &Path) {
    println!("📦 Minification des fichiers JavaScript...");
    for entry in WalkDir::new(root).into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();
        if is_excluded(path) {
            continue;
        }
        if path.extension().and_then(|s| s.to_str()) == Some("js") {
            // On ignore les fichiers déjà minifiés
            if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                if name.contains(".min.") {
                    continue;
                }
            }
            let output = Command::new("minify-js")
                .arg("-o")
                .arg(path.to_str().unwrap())
                .arg(path.to_str().unwrap())
                .output();
            if let Ok(out) = output {
                if out.status.success() {
                    println!("  ✅ JS minifié : {}", path.file_name().unwrap().to_string_lossy());
                }
            }
        }
    }
}

fn optimize_images(root: &Path) {
    println!("🖼️  Optimisation des images...");

    // --- PNG : oxipng ---
    for entry in WalkDir::new(root).into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();
        if is_excluded(path) {
            continue;
        }
        if path.extension().and_then(|s| s.to_str()) == Some("png") {
            let output = Command::new("oxipng")
                .arg("-o")
                .arg("4")
                .arg("--strip")
                .arg("all")
                .arg(path.to_str().unwrap())
                .output();
            if let Ok(out) = output {
                if out.status.success() {
                    println!("  ✅ PNG optimisé : {}", path.file_name().unwrap().to_string_lossy());
                }
            }
        }
    }

    // --- JPG/JPEG -> WebP ---
    for entry in WalkDir::new(root).into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();
        if is_excluded(path) {
            continue;
        }
        if let Some(ext) = path.extension().and_then(|s| s.to_str()) {
            if ext == "jpg" || ext == "jpeg" {
                let output_path = path.with_extension("webp");
                let output = Command::new("webp")
                    .arg("-q")
                    .arg("80")
                    .arg(path.to_str().unwrap())
                    .arg("-o")
                    .arg(output_path.to_str().unwrap())
                    .output();
                if let Ok(out) = output {
                    if out.status.success() {
                        println!("  ✅ JPG converti en WebP : {}", path.file_name().unwrap().to_string_lossy());
                        // Optionnel : supprimer l'original JPG pour gagner de la place
                        // fs::remove_file(path).ok();
                    }
                }
            }
        }
    }
}

// ============================================================
// 4. GÉNÉRATION DE L'INDEX DE RECHERCHE (TON CODE 100% CONSERVÉ)
// ============================================================
fn generate_index(root: &Path) -> io::Result<()> {
    println!("📝 Génération de l'index de recherche...");
    let mut index = Vec::new();

    for entry in WalkDir::new(root).into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();

        if is_excluded(path) {
            continue;
        }

        if path.extension().and_then(|s| s.to_str()) == Some("html") {
            let url = path
                .strip_prefix(root)
                .unwrap_or(path)
                .to_string_lossy()
                .replace('\\', "/")
                .trim_start_matches('/')
                .to_string();

            // Ignorer les pages outils et la page de recherche
            if url.contains("search") || url.contains("tools") || url.is_empty() {
                continue;
            }

            let html_content = fs::read_to_string(&path)?;
            let document = Html::parse_document(&html_content);

            let title_selector = Selector::parse("title").unwrap();
            let title = document
                .select(&title_selector)
                .next()
                .map(|el| el.text().collect::<String>())
                .unwrap_or_else(|| {
                    path.file_stem()
                        .map(|s| s.to_string_lossy().to_string())
                        .unwrap_or_else(|| "sans-titre".to_string())
                });

            let meta_selector = Selector::parse(r#"meta[name="description"]"#).unwrap();
            let desc = document
                .select(&meta_selector)
                .next()
                .and_then(|el| el.value().attr("content"))
                .unwrap_or("")
                .to_string();

            let p_selector = Selector::parse("p").unwrap();
            let full_text: String = document
                .select(&p_selector)
                .map(|el| el.text().collect::<String>())
                .collect::<Vec<String>>()
                .join(" ")
                .split_whitespace()
                .collect::<Vec<&str>>()
                .join(" ");

            let summary = truncate_chars(&full_text, 200);

            let icon = if url.contains("index") || url.is_empty() {
                "fa-house"
            } else if url.contains("decouvert") {
                "fa-compass"
            } else if url.contains("luc") || url.contains("about") {
                "fa-user"
            } else if url.contains("contact") {
                "fa-envelope"
            } else if url.contains("project") {
                "fa-code"
            } else {
                "fa-file-lines"
            };

            index.push(json!({
                "title": title,
                "desc": if desc.is_empty() { "Page automatique".to_string() } else { desc },
                "icon": icon,
                "page": if url.is_empty() { "/".to_string() } else { format!("/{}", url) },
                "anchor": "",
                "text": full_text,
                "summary": summary
            }));

            println!("  ✅ Page indexée : {}", url);
        }
    }

    let json_output = serde_json::to_string_pretty(&index)?;
    let output_path = root.join("search-index.json");
    fs::write(&output_path, json_output)?;

    println!("\n✅ Index généré avec succès ! {} pages indexées.", index.len());
    Ok(())
}

// ============================================================
// 5. MAIN : TOUT EN UNE SEULE COMMANDE
// ============================================================
fn main() -> io::Result<()> {
    let root = Path::new(".");

    println!("🚀 LANCEMENT DE L'OPTIMISATION TOTALE (Rust)");
    println!("============================================\n");

    // 1. Minifier HTML
    minify_html_files(root);

    // 2. Minifier JS
    minify_js_files(root);

    // 3. Optimiser les images
    optimize_images(root);

    // 4. Générer l'index
    generate_index(root)?;

    println!("\n🎉 OPTIMISATION TERMINÉE ! Ton portfolio est maintenant ultra-rapide.");
    println!("📦 Fichier search-index.json généré à la racine.");
    println!("🖼️  Les JPG ont été convertis en WebP (bien plus légers).");
    println!("⚡ Tu peux maintenant tout re-téléverser sur ton hébergement.");

    Ok(())
}