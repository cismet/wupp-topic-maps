const TOPICMAPVERSION = "%TOPICMAP_VERSION%";
const TOPICMAPHASH = "%TOPICMAP_HASH%";

export const getTopicMapVersion=()=>{
    if (TOPICMAPVERSION===("%TOPICMAP"+"_"+"VERSION%")){
        return "0.0.0-dev";
    }
    else {
        return TOPICMAPVERSION;
    }
}
export const getTopicMapHash=()=>{
    if (TOPICMAPHASH===("%TOPICMAP"+"_"+"HASH%")){
        return "#00000-dev";
    }
    else {
        return TOPICMAPHASH;
    }
}
