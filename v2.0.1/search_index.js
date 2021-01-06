var documenterSearchIndex = {"docs":
[{"location":"index.html#MultiDimEquations.jl","page":"Index","title":"MultiDimEquations.jl","text":"","category":"section"},{"location":"index.html","page":"Index","title":"Index","text":"Documentation for the MultiDimEquations.jl package","category":"page"},{"location":"index.html#The-MultiDimEquations-Module","page":"Index","title":"The MultiDimEquations Module","text":"","category":"section"},{"location":"index.html","page":"Index","title":"Index","text":"MultiDimEquations","category":"page"},{"location":"index.html#MultiDimEquations","page":"Index","title":"MultiDimEquations","text":"MultiDimEquations\n\nThe package provides handy functions to work with NDSparse (from IndexedTables.jl package) or standard arrays in order to write equations in a concise and readable way. The formers can be accessed by name, but are somehow slower, the latters are faster but need to be accessed by position.\n\ndefVars() defines either empty NDSparse with the dimensions (axis) required or arrays with the required size and prefilled with missing values. More variables can be defined at once.\n\ndefLoadVar() and defLoadVars() allow to define and import the variables from a DataFrame in long format (dim1|dim2|...|value), with the second one allowing to import more varaibles at once, given the presence of a column in the database with the variable names.\n\n@meq is a macro that allows to write your \"model equations\" more concisely, e.g. @meq par1[d1 in DIM1, d2 in DIM2, dfix3] =  par2[d1,d2]+par3[d1,d2] would be expanded to use the list comprehension expression above: [par1[d1,d2,dfix3] =  par2[d1,d2]+par3[d1,d2] for d1 in DIM1, d2 in DIM2]\n\n\n\n\n\n","category":"module"},{"location":"index.html#Module-Index","page":"Index","title":"Module Index","text":"","category":"section"},{"location":"index.html","page":"Index","title":"Index","text":"Modules = [MultiDimEquations]\nOrder   = [:constant, :type, :function, :macro]","category":"page"},{"location":"index.html#Example","page":"Index","title":"Example","text":"","category":"section"},{"location":"index.html#Input-data...","page":"Index","title":"Input data...","text":"","category":"section"},{"location":"index.html","page":"Index","title":"Index","text":"df = CSV.read(IOBuffer(\"\"\"\nreg prod var value\nus banana production 10\nus banana transfCoef    0.6\nus banana trValues      2\nus apples production    7\nus apples transfCoef    0.7\nus apples trValues      5\nus juice production     missing\nus juice transfCoef     missing\nus juice trValues       missing\neu banana production    5\neu banana transfCoef    0.7\neu banana trValues      1\neu apples production    8\neu apples transfCoef    0.8\neu apples trValues 4\neu juice production missing\neu juice transfCoef missing\neu juice trValues missing\n\"\"\"), DataFrame, delim=\" \", ignorerepeated=true, copycols=true, missingstring=\"missing\")","category":"page"},{"location":"index.html#...using-NDSparse:","page":"Index","title":"...using NDSparse:","text":"","category":"section"},{"location":"index.html","page":"Index","title":"Index","text":"reg      = unique(df.reg)\nproducts = unique(df.prod)\nprimPr   = products[1:2]\nsecPr    = [products[3]]\n\n(production,transfCoef,trValues) = defLoadVars([\"production\",\"transfCoef\",\"trValues\"], df,[\"reg\",\"prod\"], varNameCol=\"var\", valueCol=\"value\",sparse=true)\nconsumption                      = defVars([\"reg\",\"prod\"],[String,String])\n\n# equivalent to [production[r, sp] = sum(trValues[r,pp] * transfCoef[r,pp]  for pp in primPr) for r in reg, sp in secPr]\n@meq production[r in reg, sp in secPr]   = sum(trValues[r,pp] * transfCoef[r,pp]  for pp in primPr)\n@meq consumption[r in reg, pp in primPr] = production[r,pp] - trValues[r,pp]\n@meq consumption[r in reg, sp in secPr]  = production[r, sp]","category":"page"},{"location":"index.html#...using-normal-arrays:","page":"Index","title":"...using normal arrays:","text":"","category":"section"},{"location":"index.html","page":"Index","title":"Index","text":"reg      = unique(df.reg)\nproducts = unique(df.prod)\nprimPrIdx = [1,2]\nsecPrIdx  = [3]\n\n(production,transfCoef,trValues) = defLoadVars([\"production\",\"transfCoef\",\"trValues\"], df,[\"reg\",\"prod\"], varNameCol=\"var\", valueCol=\"value\",sparse=false)\nconsumption                      = defVars([length(reg),length(products))\n\n@meq production[r in eachindex(reg), sp in secPrIdx]   =  sum(trValues[r,pp] * transfCoef[r,pp]  for pp in primPrIdx)\n@meq consumption[r in eachindex(reg), pp in primPrIdx] = production[r,pp] - trValues[r,pp]\n@meq consumption[r in eachindex(reg), sp in secPrIdx]  = production[r, sp]","category":"page"},{"location":"index.html#Detailed-API","page":"Index","title":"Detailed API","text":"","category":"section"},{"location":"index.html","page":"Index","title":"Index","text":"Modules = [MultiDimEquations]\nOrder   = [:constant, :type, :function, :macro]","category":"page"},{"location":"index.html#MultiDimEquations.defLoadVar-Tuple{Any,Any}","page":"Index","title":"MultiDimEquations.defLoadVar","text":"defLoadVar(df, dimsNameCols; <keyword arguments>)\n\nDefine the required IndexedTables or Arrays and load the data from a DataFrame in long format while specifing the dimensional columns.\n\nArguments\n\ndf: The source of the dataframe, that must be in the format dim1|dim2|...|value\ndimsNameCols: The names of the columns corresponding to the dimensions over which the variables are defined (the keys)\nvalueCol (def: \"value\"): The name of the column in the df containing the values\nsparse (def: \"true\"): Wheter to return NDSparse elements (from IndexedTable) or standard arrays\n\nNotes\n\nSparse indexed tables can be accessed by element but are slower, standard arrays need to be accessed by position but are faster\n\nExamples\n\njulia> vol  = defVars(volumeData,[\"region\",\"treeSpecie\",\"year\"], valueCol=\"value\")\n\n\n\n\n\n","category":"method"},{"location":"index.html#MultiDimEquations.defLoadVars-Tuple{Any,Any,Any}","page":"Index","title":"MultiDimEquations.defLoadVars","text":"defLoadVars(vars, df, dimsNameCols; <keyword arguments>)\n\nDefine the required IndexedTables or Arrays and load the data from a DataFrame in long format while specifing the dimensional columns and the column containing the variable names.\n\nLike varLoadVar but here we are extracting multiple variables at once, with one column of the input dataframe storing the variable name.\n\nArguments\n\nvars: The array of variables to lookup\ndf: The source of the dataframe, that must be in the format dim1|dim2|...|varName|value\ndimsNameCols: The name of the column containing the dimensions over which the variables are defined\nvarNameCol (def: \"varName\"): The name of the column in the df containing the variables names\nvalueCol (def: \"value\"): The name of the column in the df containing the values\nsparse (def: \"true\"): Wheter to return NDSparse elements (from IndexedTable) or standard arrays\n\nNotes\n\nSparse indexed tables can be accessed by element but are slower, standard arrays need to be accessed by position but are faster\n\nExamples\n\njulia> (vol,numberOfTrees)  = defVars([\"vol\",\"numberOfTrees\"], forestData,[\"region\",\"treeSpecie\",\"year\"], varNameCol=\"parName\", valueCol=\"value\")\n\n\n\n\n\n","category":"method"},{"location":"index.html#MultiDimEquations.defVars-Tuple{Any,Any}","page":"Index","title":"MultiDimEquations.defVars","text":"defVars(dimNames, dimTypes; <keyword arguments>)\n\nDefine empty NDSparse IndexedTable(s) with the specific dimension(s) and type.\n\nArguments\n\ndimNames: Array of names of the dimensions to define\ndimTypes: Array of types of the dimensions\nvalueType (def: Float64):  Type of the value column of the table\nn (def=1): Number of copies of the specified tables to return (useful to define multiple variables at once. In such cases a tuple is returned)\n\n# Examples\n\n```julia\n\njulia> price,demand,supply = defVars([\"region\",\"item\",\"class\"],[String,String,Int64],valueType=Float64,n=3 )\n\njulia> waterContent = defVars([\"region\",\"item\"],[String,String])\n\njulia> price[\"US\",\"apple\",1] = 3.2\n\njulia> waterContent[\"US\",\"apple\"] = 0.2\n\n```\n\n\n\n\n\n\n\n","category":"method"},{"location":"index.html#MultiDimEquations.defVars-Tuple{Any}","page":"Index","title":"MultiDimEquations.defVars","text":"defVars(size; <keyword arguments>)\n\nDefine multidimensional array(s) with the specific dimension(s) and type filled all with missing values.\n\nArguments\n\nsize: Tuple of the dimensions required\nvalueType (def: Float64):  Inner type of the array required\nn (def=1): Number of copies of the specified tables to return (useful to define multiple variables at once. In such cases a tuple is returned)\n\n# Examples\n\n```julia\n\njulia> price,demand,supply = defVars((3,4,5),valueType=Float64,n=3 )\n\njulia> waterContent = defVars((3,4))\n\njulia> price[2,3,1] = 3.2\n\njulia> waterContent[2,3] = 0.2\n\n```\n\n\n\n\n\n\n\n","category":"method"},{"location":"index.html#MultiDimEquations.@meq-Tuple{Any}","page":"Index","title":"MultiDimEquations.@meq","text":"meq(exp)\n\nMacro to expand functions like t[d1 in dim1, d2 in dim2, dfix,..] = value\n\nWith this macro it is possible to write:\n\n@meq par1[d1 in DIM1, d2 in DIM2, dfix3] =  par2[d1,d2]+par3[d1,d2]\n\nand obtain\n\n[par1[d1,d2,dfix3] =  par2[d1,d2]+par3[d1,d2] for d1 in DIM1, d2 in DIM2]\n\nThat is, it is possible to write \"model equations\" in a concise and readable way.\n\n\n\n\n\n","category":"macro"}]
}