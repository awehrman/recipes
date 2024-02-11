-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "Properties" AS ENUM ('MEAT', 'POULTRY', 'FISH', 'DAIRY', 'SOY', 'GLUTEN');

-- CreateEnum
CREATE TYPE "ParserRuleDefinitionType" AS ENUM ('RULE', 'LIST');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "note_import_offset" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "evernote_sessions" (
    "id" TEXT NOT NULL,
    "expires" TIMESTAMP(3),
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "authURL" TEXT,
    "oauthVerifier" TEXT,
    "error" TEXT,
    "loading" BOOLEAN NOT NULL DEFAULT false,
    "evernote_auth_token" TEXT,
    "evernote_req_token" TEXT,
    "evernote_req_secret" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "evernote_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "plural" TEXT,
    "properties" "Properties"[],
    "is_composed_ingredient" BOOLEAN NOT NULL DEFAULT false,
    "is_validated" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alternate_names" (
    "name" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imported_user_id" TEXT NOT NULL,
    "evernote_guid" TEXT,
    "title" TEXT NOT NULL,
    "sources" TEXT[],
    "image" TEXT NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "evernote_guid" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "evernote_guid" TEXT,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_lines" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "block_index" INTEGER NOT NULL,
    "line_index" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "rule" TEXT,
    "is_parsed" BOOLEAN NOT NULL,
    "recipeId" TEXT,
    "noteId" TEXT,
    "ingredientId" TEXT,

    CONSTRAINT "ingredient_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instruction_lines" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "block_index" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "noteId" TEXT,
    "recipeId" TEXT,

    CONSTRAINT "instruction_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parsed_segments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "rule" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "ingredient_id" TEXT,
    "ingredient_line_id" TEXT NOT NULL,

    CONSTRAINT "parsed_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "evernote_guid" TEXT,
    "title" TEXT NOT NULL,
    "source" TEXT,
    "image" TEXT,
    "content" TEXT,
    "is_parsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parser_rules" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "parser_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parser_rule_definition" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "example" TEXT NOT NULL,
    "formatter" TEXT,
    "order" INTEGER NOT NULL,
    "rule" TEXT NOT NULL,
    "type" "ParserRuleDefinitionType" NOT NULL,
    "list" TEXT[],
    "parserRuleId" TEXT,

    CONSTRAINT "parser_rule_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_substitutes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RecipeToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToNote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_NoteToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_name_key" ON "ingredients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_plural_key" ON "ingredients"("plural");

-- CreateIndex
CREATE UNIQUE INDEX "alternate_names_name_key" ON "alternate_names"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_evernote_guid_key" ON "categories"("evernote_guid");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_evernote_guid_key" ON "tags"("evernote_guid");

-- CreateIndex
CREATE UNIQUE INDEX "_substitutes_AB_unique" ON "_substitutes"("A", "B");

-- CreateIndex
CREATE INDEX "_substitutes_B_index" ON "_substitutes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RecipeToTag_AB_unique" ON "_RecipeToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_RecipeToTag_B_index" ON "_RecipeToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToRecipe_AB_unique" ON "_CategoryToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToRecipe_B_index" ON "_CategoryToRecipe"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToNote_AB_unique" ON "_CategoryToNote"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToNote_B_index" ON "_CategoryToNote"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_NoteToTag_AB_unique" ON "_NoteToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_NoteToTag_B_index" ON "_NoteToTag"("B");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evernote_sessions" ADD CONSTRAINT "evernote_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alternate_names" ADD CONSTRAINT "alternate_names_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_imported_user_id_fkey" FOREIGN KEY ("imported_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_lines" ADD CONSTRAINT "ingredient_lines_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_lines" ADD CONSTRAINT "ingredient_lines_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_lines" ADD CONSTRAINT "ingredient_lines_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instruction_lines" ADD CONSTRAINT "instruction_lines_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instruction_lines" ADD CONSTRAINT "instruction_lines_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parsed_segments" ADD CONSTRAINT "parsed_segments_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parsed_segments" ADD CONSTRAINT "parsed_segments_ingredient_line_id_fkey" FOREIGN KEY ("ingredient_line_id") REFERENCES "ingredient_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parser_rule_definition" ADD CONSTRAINT "parser_rule_definition_parserRuleId_fkey" FOREIGN KEY ("parserRuleId") REFERENCES "parser_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_substitutes" ADD CONSTRAINT "_substitutes_A_fkey" FOREIGN KEY ("A") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_substitutes" ADD CONSTRAINT "_substitutes_B_fkey" FOREIGN KEY ("B") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeToTag" ADD CONSTRAINT "_RecipeToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeToTag" ADD CONSTRAINT "_RecipeToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToRecipe" ADD CONSTRAINT "_CategoryToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToRecipe" ADD CONSTRAINT "_CategoryToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToNote" ADD CONSTRAINT "_CategoryToNote_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToNote" ADD CONSTRAINT "_CategoryToNote_B_fkey" FOREIGN KEY ("B") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteToTag" ADD CONSTRAINT "_NoteToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteToTag" ADD CONSTRAINT "_NoteToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
