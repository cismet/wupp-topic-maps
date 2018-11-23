const TOPICMAPVERSION = "%TOPICMAP_VERSION%";
const TOPICMAPHASH = "%TOPICMAP_HASH%";

export const getTopicMapVersion=()=>{
    if (TOPICMAPVERSION===("%TOPICMAP"+"_"+"VERSION%")){
        return "dev-hot-reload";
    }
    else {
        return TOPICMAPVERSION;
    }
}
export const getTopicMapHash=()=>{
    if (TOPICMAPHASH===("%TOPICMAP"+"_"+"HASH%")){
        return "#dev-hot-reload";
    }
    else {
        return TOPICMAPHASH;
    }
}
