json.partial! "pictures/picture", picture: @picture

json.pic_url do
    json.medium @picture.picfile.url(:medium)
    json.small @picture.picfile.url(:small)
end

json.category do
    json.name @picture.category.name
end