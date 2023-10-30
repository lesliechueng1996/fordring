-- CreateTable
CREATE TABLE "t_user" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "password" VARCHAR(256) NOT NULL,
    "nick_name" VARCHAR(32) NOT NULL,
    "avatar_url" VARCHAR(256),
    "last_login_time" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,
    "last_error_time" TIMESTAMP(3),
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "last_login_ip" VARCHAR(128),
    "last_error_ip" VARCHAR(128),
    "description" VARCHAR(512),
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL,

    CONSTRAINT "t_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_album" (
    "id" SERIAL NOT NULL,
    "display_name" VARCHAR(16) NOT NULL,
    "folder_name" VARCHAR(32) NOT NULL,
    "description" VARCHAR(256),
    "preview_url" VARCHAR(256),
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL,

    CONSTRAINT "t_album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_article" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "author" VARCHAR(32) NOT NULL,
    "content" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "category_id" INTEGER,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "preview_url" VARCHAR(256),
    "is_top" BOOLEAN NOT NULL DEFAULT false,
    "is_fire" BOOLEAN NOT NULL DEFAULT false,
    "is_draft" BOOLEAN NOT NULL DEFAULT false,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL,

    CONSTRAINT "t_article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_category" (
    "id" SERIAL NOT NULL,
    "category_name" VARCHAR(32) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL,

    CONSTRAINT "t_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_picture" (
    "id" SERIAL NOT NULL,
    "album_id" INTEGER NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" VARCHAR(256),
    "url" VARCHAR(512) NOT NULL,
    "storage_key" VARCHAR(128) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL,

    CONSTRAINT "t_picture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_tag" (
    "id" SERIAL NOT NULL,
    "tag_name" VARCHAR(32) NOT NULL,
    "color" VARCHAR(16) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL,

    CONSTRAINT "t_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleToTag" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ArticleToPicture" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "t_user_email_key" ON "t_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToTag_AB_unique" ON "_ArticleToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToTag_B_index" ON "_ArticleToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToPicture_AB_unique" ON "_ArticleToPicture"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToPicture_B_index" ON "_ArticleToPicture"("B");

-- AddForeignKey
ALTER TABLE "t_article" ADD CONSTRAINT "t_article_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "t_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_picture" ADD CONSTRAINT "t_picture_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "t_album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToTag" ADD CONSTRAINT "_ArticleToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "t_article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToTag" ADD CONSTRAINT "_ArticleToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "t_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToPicture" ADD CONSTRAINT "_ArticleToPicture_A_fkey" FOREIGN KEY ("A") REFERENCES "t_article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToPicture" ADD CONSTRAINT "_ArticleToPicture_B_fkey" FOREIGN KEY ("B") REFERENCES "t_picture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
