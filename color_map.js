var colors=["#18c61a","#9817ff","#d31911","#24b7f1","#fa82ce","#736c31","#1263e2","#18c199","#ed990a","#f2917f","#7b637c","#a1b510","#a438c0","#d00d5e","#1e7b1d","#05767b","#aaa1f9","#a5aea1","#a75312","#026eb8","#92b66d","#91529e","#caa74f","#c90392","#a84e5d","#6a4cf1","#1ac463","#d89ab1","#3c764d","#fb78fa","#2dbdc5","#a6a9cd","#c1383d","#935e41","#656d61","#f49352","#cea37e","#b53c7e","#436f90","#73be38","#5e7304","#fb88a3","#6a5cc0","#dd8df2","#78b992","#d098d5","#ac15dc","#c9a918","#8e620d","#7fadf1","#99537d","#7db3c5"]

var ctrs = ["Afghanistan",
"Algeria",
"Australia",
"Bahrain",
"Belgium",
"Burundi",
"Cameroon",
"Canada",
"Chad",
"Czech Republic",
"Denmark",
"Egypt",
"France",
"Georgia",
"Germany",
"India",
"Iran",
"Iraq",
"Italy",
"Jordan",
"Lebanon",
"Libya",
"Morocco",
"Netherlands",
"Niger",
"Nigeria",
"Norway",
"Pakistan",
"Poland",
"Romania",
"Russia",
"Saudi Arabia",
"Spain",
"Sweden",
"Syria",
"Tajikistan",
"Turkey",
"Turkmenistan",
"United Arab Emirates",
"United Kingdom",
"United States",
"Uzbekistan",
"Yemen"]


var color_map = {}

for(var i = 0; i < ctrs.length; i++){
    color_map[ctrs[i]] = colors[i];
}

console.log(color_map);