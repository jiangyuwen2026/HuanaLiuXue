-- 为案例表添加首图字段
ALTER TABLE `cases` 
ADD COLUMN IF NOT EXISTS `cover` VARCHAR(500) NULL COMMENT '案例首图URL' AFTER `story`;
