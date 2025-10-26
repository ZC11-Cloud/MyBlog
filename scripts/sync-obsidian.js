import fs from "fs"
import path from "path"

// 配置项
const config = {
    // 替换为您的 Obsidian 文件夹路径
    obsidianDir: "D:/Path/To/Your/Obsidian/BlogPosts",
    blogDir: "./src/content/posts/",
    // 文章默认设置
    defaultSettings: {
        draft: false,
        lang: 'zh-CN'
    }
}

function getDate() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

function processFrontMatter(content, fileName) {
    // 检查文件是否已有 front matter
    const hasFrontMatter = content.startsWith('---')
    
    if (hasFrontMatter) {
        // 如果已有 front matter，确保必要的字段存在
        return content
    }

    // 如果没有 front matter，创建一个新的
    const title = path.basename(fileName, path.extname(fileName))
    const frontMatter = `---
title: ${title}
published: ${getDate()}
description: ''
tags: []
category: ''
draft: ${config.defaultSettings.draft}
lang: ${config.defaultSettings.lang}
---

`
    return frontMatter + content
}

function syncPosts() {
    // 确保目标目录存在
    if (!fs.existsSync(config.blogDir)) {
        fs.mkdirSync(config.blogDir, { recursive: true })
    }

    // 读取 Obsidian 目录中的所有 markdown 文件
    const files = fs.readdirSync(config.obsidianDir)
        .filter(file => file.endsWith('.md'))

    files.forEach(file => {
        const sourcePath = path.join(config.obsidianDir, file)
        const targetPath = path.join(config.blogDir, file)

        // 读取文件内容
        const content = fs.readFileSync(sourcePath, 'utf-8')
        
        // 处理 front matter
        const processedContent = processFrontMatter(content, file)

        // 写入博客目录
        fs.writeFileSync(targetPath, processedContent)
        console.log(`Synced: ${file}`)
    })
}

// 执行同步
try {
    syncPosts()
    console.log('Sync completed successfully!')
} catch (error) {
    console.error('Error during sync:', error)
}