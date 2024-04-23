async function OnChangeNewYoutubeLayout(){
     localStorage["Newtube_NewYoutubeLayout"] = await Load("NewYoutubeLayout")
}

RunAfterLoaded.NormalYoutube.push(function () {
     OnChangeNewYoutubeLayout()
     AddOnChangeFunction("NewYoutubeLayout", OnChangeNewYoutubeLayout)
})