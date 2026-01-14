(() => {

/* ================= CONFIG ================= */

const UI = {
    w: 300,
    itemH: 36,
    maxVisible: 6,
    font: "Inter, system-ui, sans-serif",
    themes: {
        blue:{main:"#646cff",bg:"rgba(16,16,20,.9)"},
        red:{main:"#ff6464",bg:"rgba(20,16,16,.9)"},
        green:{main:"#64ff64",bg:"rgba(16,20,16,.9)"},
        rainbow:{main:"#fff",bg:"rgba(16,16,20,.9)",rgb:true}
    }
};

let currentTheme="blue";
let rgbHue=0;

/* ================= DATA ================= */

const structure={
    Main:["Self","Online","Visual","Combat","Vehicle","Settings"],
    Self:["Godmode","Heal","No Ragdoll","Test1","Test2","Test3","Test4"],
    Online:["Player List","Spectate"],
    Visual:["ESP","Night Vision","Crosshair"],
    Combat:["Aimbot","No Recoil"],
    Vehicle:["Speed Boost","God Vehicle"],
    Settings:["Custom","Config"],
    Custom:["Color","Banner"],
    Color:["Theme Blue","Theme Red","Theme Green","Theme Rainbow"],
    Banner:["Banner 1","Banner 2","Banner 3"],
    Config:["Save Config"]
};

let menu="Main";
let indexMap={}, toggles={};
Object.keys(structure).forEach(k=>indexMap[k]=0);

/* ================= BANNERS ================= */

const banners={
    "Banner 1":"https://media.discordapp.net/attachments/1454224277095186523/1460969368308547739/vanity_logo_green.png",
    "Banner 2":"https://media.discordapp.net/attachments/1454224277095186523/1460969368308547739/vanity_logo_green.png",
    "Banner 3":"https://media.discordapp.net/attachments/1454224277095186523/1460969368308547739/vanity_logo_green.png"
};
let currentBanner="Banner 1";

/* ================= ROOT ================= */

document.body.style.margin=0;
document.body.style.background="#0a0a0a";
document.body.style.fontFamily=UI.font;

/* ================= MENU ================= */

const menuBox=document.createElement("div");
Object.assign(menuBox.style,{
    width:UI.w+"px",
    background:UI.themes[currentTheme].bg,
    position:"fixed",
    top:"50%",
    left:"20%",
    transform:"translate(-50%,-50%) scale(.9)",
    opacity:0,
    transition:"all .35s cubic-bezier(.25,.8,.25,1)",
    overflow:"hidden",
    borderRadius:"6px",
    zIndex:9999
});
document.body.appendChild(menuBox);

/* ================= HEADER ================= */

const header=document.createElement("div");
Object.assign(header.style,{height:"80px"});
menuBox.appendChild(header);

const banner=document.createElement("img");
banner.src=banners[currentBanner];
Object.assign(banner.style,{
    width:"100%",
    height:"100%",
    objectFit:"cover",
    opacity:1
});
header.appendChild(banner);

/* ================= LIST ================= */

const listWrap=document.createElement("div");
Object.assign(listWrap.style,{
    position:"relative",
    height:UI.maxVisible * UI.itemH + "px",
    overflow:"hidden"
});
menuBox.appendChild(listWrap);

/* selector */

const selector=document.createElement("div");
Object.assign(selector.style,{
    position:"absolute",
    left:0,
    top:0,
    width:"100%",
    height:UI.itemH+"px",
    transition:"transform .25s cubic-bezier(.25,.8,.25,1)"
});
listWrap.appendChild(selector);

/* scrollbar */

const scrollBar=document.createElement("div");
Object.assign(scrollBar.style,{
    position:"absolute",
    right:"6px",
    top:"0",
    width:"3px",
    borderRadius:"10px",
    opacity:.9,
    zIndex:10,
    transition:"all .25s cubic-bezier(.25,.8,.25,1)"
});
listWrap.appendChild(scrollBar);

/* ================= RENDER ================= */

function render(){
    listWrap.querySelectorAll(".item").forEach(e=>e.remove());

    let items=[...structure[menu]];
    const total=items.length;

    const start=Math.max(0,Math.min(indexMap[menu]-UI.maxVisible+1,total-UI.maxVisible));
    const visible=items.slice(start,start+UI.maxVisible);

    visible.forEach((txt)=>{
        const it=document.createElement("div");
        it.className="item";
        it.innerHTML=`<span>${txt}</span>`;

        Object.assign(it.style,{
            height:UI.itemH+"px",
            padding:"0 14px",
            display:"flex",
            alignItems:"center",
            color:"#eee",
            fontSize:"13px",
            borderBottom:"1px solid rgba(255,255,255,.04)"
        });

        listWrap.appendChild(it);
    });

    selector.style.transform=`translateY(${(indexMap[menu]-start)*UI.itemH}px)`;

    /* scrollbar */
    if(total>UI.maxVisible){
        const ratio=UI.maxVisible/total;
        const barH=Math.max(30,ratio*UI.maxVisible*UI.itemH);
        const maxScroll=total-UI.maxVisible;
        const scrollY=(indexMap[menu]/maxScroll)*(UI.maxVisible*UI.itemH-barH);

        scrollBar.style.height=barH+"px";
        scrollBar.style.transform=`translateY(${scrollY}px)`;
        scrollBar.style.display="block";
    } else scrollBar.style.display="none";
}

/* ================= THEME ================= */

function applyTheme(){
    const t=UI.themes[currentTheme];
    const col=t.rgb?`hsl(${rgbHue},100%,60%)`:t.main;

    menuBox.style.background=t.bg;
    selector.style.background=col+"22";
    selector.style.borderLeft=`2px solid ${col}`;
    scrollBar.style.background=col;
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
        menuBox.style.transform=visible
            ?"translate(-50%,-50%) scale(1)"
            :"translate(-50%,-50%) scale(.9)";
    }
    if(!visible)return;

    const items=[...structure[menu]];

    if(e.key==="ArrowDown") indexMap[menu]=Math.min(items.length-1,indexMap[menu]+1);
    if(e.key==="ArrowUp") indexMap[menu]=Math.max(0,indexMap[menu]-1);

    applyTheme();
    render();
});

/* ================= START ================= */

applyTheme();
render();

})();
