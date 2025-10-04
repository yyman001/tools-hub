-- 插入示例分类数据
INSERT INTO categories (name_zh, name_en, parent_id, sort_order) VALUES
('开发工具', 'Development Tools', NULL, 1),
('设计工具', 'Design Tools', NULL, 2),
('办公软件', 'Office Software', NULL, 3),
('系统工具', 'System Tools', NULL, 4),
('网络工具', 'Network Tools', NULL, 5);

-- 插入二级分类
INSERT INTO categories (name_zh, name_en, parent_id, sort_order) VALUES
('代码编辑器', 'Code Editors', 1, 1),
('版本控制', 'Version Control', 1, 2),
('API工具', 'API Tools', 1, 3),
('图像编辑', 'Image Editing', 2, 1),
('UI设计', 'UI Design', 2, 2),
('文档处理', 'Document Processing', 3, 1),
('表格工具', 'Spreadsheet Tools', 3, 2),
('文件管理', 'File Management', 4, 1),
('系统监控', 'System Monitoring', 4, 2),
('网络分析', 'Network Analysis', 5, 1);

-- 插入示例工具数据
INSERT INTO tools (
  name_zh, name_en, 
  description_zh, description_en,
  homepage_url, 
  supported_platforms,
  primary_category_id, secondary_category_id
) VALUES
(
  'Visual Studio Code', 'Visual Studio Code',
  '微软开发的免费代码编辑器，支持多种编程语言和丰富的扩展生态。', 
  'A free code editor developed by Microsoft with support for multiple programming languages and rich extension ecosystem.',
  'https://code.visualstudio.com',
  '["windows", "macos", "linux"]',
  1, 1
),
(
  'Figma', 'Figma',
  '基于浏览器的协作式界面设计工具，支持实时协作和原型制作。',
  'Browser-based collaborative interface design tool with real-time collaboration and prototyping capabilities.',
  'https://figma.com',
  '["web", "windows", "macos"]',
  2, 2
);