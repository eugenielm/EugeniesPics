json.partial! "categories/category", category: @category

json.catpic_url do
    json.medium @category.catpic.url(:medium)
    json.small @category.catpic.url(:small)
end