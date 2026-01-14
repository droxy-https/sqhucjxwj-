(() => {

/* ================= CONFIG ================= */

const UI = {
    w: 300,
    itemH: 36,
    font: "Inter, system-ui, sans-serif",
    fontSizeItem: "13px",
    fontSizeFooter: "11px",
    fontSizeNotif: "12px",
    themes: {
        blue:{main:"#646cff",bg:"rgba(16,16,20,.85)"},
        red:{main:"#ff6464",bg:"rgba(20,16,16,.85)"},
        green:{main:"#64ff64",bg:"rgba(16,20,16,.85)"},
        rainbow:{main:"#fff",bg:"rgba(16,16,20,.85)",rgb:true}
    }
};

let currentTheme="blue";
let rgbHue=0;

/* ================= DATA ================= */

const structure={
    Main:["Self","Online","Visual","Combat","Vehicle","Settings"],
    Self:["Godmode","Heal","No Ragdoll"],
    Online:["Player List","Spectate"],
    Visual:["ESP","Night Vision","Crosshair"],
    Combat:["Aimbot","No Recoil"],
    Vehicle:["Speed Boost","God Vehicle"],
    Settings:["Custom","Config"],
    Custom:["Color","Banner"],
    Color:["Theme Blue","Theme Red","Theme Green","Theme Rainbow"],
    Banner:["blacked","atu","Banner 3"],
    Config:["Save Config"]
};

let menu="Main";
let indexMap={};
let toggles={};
Object.keys(structure).forEach(k=>indexMap[k]=0);

/* ================= BANNERS ================= */

const banners={
    "Banner 1":"https://media.discordapp.net/attachments/1449084968734294016/1449618648615358655/image.png?ex=693f8e12&is=693e3c92&hm=41b29c37c801c71676a462a0ff00719103dfe8868e92b9d0425657450e93d615&=&format=webp&quality=lossless",
    "Banner 2":"https://media.discordapp.net/attachments/1454224277095186523/1460969368308547739/vanity_logo_green.png?ex=6968d940&is=696787c0&hm=db816f9f3ab65fc5ede0b00e07eec2083e977c2ee156c5f7b8a7a5d914d85346&=&format=webp&quality=lossless",
    "Banner 3":"https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6"
};
let currentBanner="Banner 1";

/* ================= ROOT ================= */

document.body.style.margin=0;
document.body.style.background="#0a0a0a";
document.body.style.fontFamily=UI.font;

const root=document.createElement("div");
document.body.appendChild(root);

/* ================= MENU ================= */

const menuBox=document.createElement("div");
Object.assign(menuBox.style,{
    width:UI.w+"px",
    background:UI.themes[currentTheme].bg,
    position:"fixed",
    top:"50%",
    left:"10%",
    transform:"translate(-50%,-50%) scale(.9)",
    opacity:0,
    transition:"all .3s ease",
    overflow:"hidden"
});
root.appendChild(menuBox);

/* ================= HEADER ================= */

const header=document.createElement("div");
Object.assign(header.style,{height:"80px",position:"relative"});
menuBox.appendChild(header);

const banner=document.createElement("img");
banner.src=banners[currentBanner];
Object.assign(banner.style,{
    width:"100%",
    height:"100%",
    objectFit:"cover",
    opacity:.25
});
header.appendChild(banner);

/* ================= LIST ================= */

const listWrap=document.createElement("div");
listWrap.style.position="relative";
menuBox.appendChild(listWrap);

const selector=document.createElement("div");
Object.assign(selector.style,{
    position:"absolute",
    width:"100%",
    height:UI.itemH+"px",
    background:"#ffffff22",
    borderLeft:"2px solid #fff",
    transition:"transform .2s"
});
listWrap.appendChild(selector);

/* ================= FOOTER ================= */

const footer=document.createElement("div");
Object.assign(footer.style,{
    height:"30px",
    background:"#000",
    color:"#fff",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    padding:"0 10px",
    fontSize:UI.fontSizeFooter,
    borderTop:"1px solid #444"
});
footer.innerHTML=`<span>LAST UPDATE</span><span>BETA</span>`;
menuBox.appendChild(footer);

/* ================= CONFIG SYSTEM ================= */

function getConfigs(){
    return JSON.parse(localStorage.getItem("menuConfigs")||"{}");
}
function saveConfig(name){
    const cfg=getConfigs();
    cfg[name]={
        toggles,
        currentTheme,
        currentBanner
    };
    localStorage.setItem("menuConfigs",JSON.stringify(cfg));
}
function loadConfig(name){
    const cfg=getConfigs()[name];
    if(!cfg)return;
    toggles=cfg.toggles||{};
    currentTheme=cfg.currentTheme||"blue";
    currentBanner=cfg.currentBanner||"Banner 1";
    banner.src=banners[currentBanner];
    notify(`Config loaded: ${name}`);
}

/* ================= RENDER ================= */

function render(){
    listWrap.querySelectorAll(".item").forEach(e=>e.remove());

    let items=[...structure[menu]];
    if(menu==="Config"){
        items=[...items,...Object.keys(getConfigs())];
    }

    items.forEach((txt,i)=>{
        const it=document.createElement("div");
        it.className="item";

        let right="";
        if(menu==="Config" && txt!=="Save Config") right="LOAD";
        else if(!structure[txt]&&!txt.startsWith("Theme")&&!txt.startsWith("Banner")){
            toggles[txt]=toggles[txt]||false;
            right=toggles[txt]?"ON":"OFF";
        }
        else if(structure[txt]) right=">";

        it.innerHTML=`<span>${txt}</span><span style="opacity:.6">${right}</span>`;

        Object.assign(it.style,{
            height:UI.itemH+"px",
            padding:"0 14px",
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between",
            color:"#eee",
            fontSize:UI.fontSizeItem
        });

        listWrap.appendChild(it);
    });

    selector.style.transform=`translateY(${indexMap[menu]*UI.itemH}px)`;
}

/* ================= NOTIF ================= */

const notifWrap=document.createElement("div");
Object.assign(notifWrap.style,{
    position:"fixed",
    bottom:"60px",
    right:"20px",
    display:"flex",
    flexDirection:"column",
    gap:"8px"
});
root.appendChild(notifWrap);

function notify(t){
    const n=document.createElement("div");
    Object.assign(n.style,{
        background:"#111",
        padding:"8px 12px",
        borderLeft:"2px solid #fff",
        color:"#fff",
        fontSize:UI.fontSizeNotif,
        opacity:0,
        transform:"translateX(20px)",
        transition:"all .25s"
    });
    n.textContent=t;
    notifWrap.appendChild(n);
    requestAnimationFrame(()=>{n.style.opacity=1;n.style.transform="translateX(0)";});
    setTimeout(()=>{n.style.opacity=0;setTimeout(()=>n.remove(),250);},1800);
}

/* ================= THEME ================= */

function applyTheme(){
    const t=UI.themes[currentTheme];
    const col=t.rgb?`hsl(${rgbHue},100%,60%)`:t.main;
    menuBox.style.background=t.bg;
    selector.style.background=col+"22";
    selector.style.borderLeft=`2px solid ${col}`;
    header.style.borderBottom=`1px solid ${col}55`;
}
setInterval(()=>{
    if(UI.themes[currentTheme].rgb){
        rgbHue=(rgbHue+1)%360;
        applyTheme();
    }
},30);

/* ================= CONTROLS ================= */

let visible=false;
document.addEventListener("keydown",e=>{
    if(e.key==="F2"){
        visible=!visible;
        menuBox.style.opacity=visible?1:0;
        menuBox.style.transform=visible?"translate(-50%,-50%) scale(1)":"translate(-50%,-50%) scale(.9)";
    }
    if(!visible)return;

    let items=[...structure[menu]];
    if(menu==="Config") items=[...items,...Object.keys(getConfigs())];

    let idx=indexMap[menu];

    if(e.key==="ArrowDown") indexMap[menu]=Math.min(items.length-1,idx+1);
    if(e.key==="ArrowUp") indexMap[menu]=Math.max(0,idx-1);
    if(e.key==="Backspace"&&menu!=="Main"){menu="Main";indexMap[menu]=0;}

    if(e.key==="Enter"){
        const val=items[idx];

        if(structure[val]){menu=val;indexMap[menu]=0;}
        else if(val==="Save Config"){
            const name=prompt("Config name?");
            if(name){saveConfig(name);notify("Config saved");}
        }
        else if(menu==="Config"){
            loadConfig(val);
        }
        else if(val.startsWith("Theme")){
            currentTheme=val.split(" ")[1].toLowerCase();
        }
        else if(val.startsWith("Banner")){
            currentBanner=val;
            banner.src=banners[val];
        }
        else{
            toggles[val]=!toggles[val];
            notify(`${val}: ${toggles[val]?"ON":"OFF"}`);
        }
    }

    applyTheme();
    render();
});

/* ================= START ================= */

applyTheme();
render();

})();
