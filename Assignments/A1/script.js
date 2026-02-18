/* 
    photo editor assignment
    roll num logic: even = step 2, odd = step 3
    change stepval below based on ur roll num
*/

// config - change this based on roll num
const stepval = 2; // use 2 for even, 3 for odd roll nums

// dom elem refs
const fileinp = document.getElementById("fileinp");
const chsimgbtn = document.getElementById("chsimgbtn");
const saveimgbtn = document.getElementById("saveimgbtn");
const imgprev = document.getElementById("imgprev");
const placeholder = document.getElementById("placeholder");
const filtbtns = document.querySelectorAll(".filtbtn");
const filtname = document.getElementById("filtname");
const filtval = document.getElementById("filtval");
const rngslider = document.getElementById("rngslider");
const rotleft = document.getElementById("rotleft");
const rotright = document.getElementById("rotright");
const flipx = document.getElementById("flipx");
const flipy = document.getElementById("flipy");
const resetbtn = document.getElementById("resetbtn");
const undobtn = document.getElementById("undobtn");
const redobtn = document.getElementById("redobtn");
const histlist = document.getElementById("histlist");
const sidebar = document.getElementById("sidenav");
const togglenav = document.getElementById("togglenav");

// state vars
let currfilt = "brightness";
let rotation = 0; // btn rotation in degs
let fliphval = 1; // 1 or -1
let flipvval = 1; // 1 or -1
let imgloaded = false;

// filter vals obj
let filtvals = {
    brightness: 100,
    saturation: 100,
    inversion: 0,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    rotate: 0
};

// history mngmt for undo redo
let histstack = [];
let histidx = -1;

// init on page load
window.onload = () => {
    updbtns();
};

// sidebar toggle functn
togglenav.onclick = () => {
    sidebar.classList.toggle("closed");
    // change arrow direction
    if(sidebar.classList.contains("closed")) {
        togglenav.innerText = "▶";
    } else {
        togglenav.innerText = "◀";
    }
};

// open file picker
chsimgbtn.onclick = () => {
    fileinp.click();
};

// load img functn
fileinp.onchange = () => {
    const file = fileinp.files[0];
    if(!file) return;
    
    // check if its img
    if(!file.type.startsWith("image/")) {
        alert("plz select an img file");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        imgprev.src = e.target.result;
        imgprev.classList.add("loaded");
        placeholder.classList.add("hidden");
        imgloaded = true;
        
        // reset everything and clear hist
        histstack = [];
        histidx = -1;
        resetallfilts();
    };
    reader.readAsDataURL(file);
};

// reset all filters functn
const resetallfilts = () => {
    // reset vals
    filtvals = {
        brightness: 100,
        saturation: 100,
        inversion: 0,
        grayscale: 0,
        sepia: 0,
        blur: 0,
        rotate: 0
    };
    rotation = 0;
    fliphval = 1;
    flipvval = 1;
    
    // reset ui
    currfilt = "brightness";
    filtbtns[0].click();
    applyfilts();
    
    // save state - either initial or reset
    if(histstack.length === 0) {
        savstate("Initial State");
    } else {
        savstate("Reset Filters");
    }
};

resetbtn.onclick = resetallfilts;

// apply all filters to img
const applyfilts = () => {
    if(!imgloaded) return;
    
    // css transform for rot and flip (btn rotation + slider rotation)
    const totalrot = rotation + parseInt(filtvals.rotate);
    imgprev.style.transform = `rotate(${totalrot}deg) scale(${fliphval}, ${flipvval})`;
    
    // css filter prop for color adjustmnts
    const cssfilt = `brightness(${filtvals.brightness}%) saturate(${filtvals.saturation}%) invert(${filtvals.inversion}%) grayscale(${filtvals.grayscale}%) sepia(${filtvals.sepia}%) blur(${filtvals.blur}px)`;
    imgprev.style.filter = cssfilt;
};

// update slider based on curr filter
const updslider = () => {
    // set name
    const dispname = currfilt.charAt(0).toUpperCase() + currfilt.slice(1);
    filtname.innerText = dispname;
    
    // set range and val based on filter type
    if(currfilt === "brightness" || currfilt === "saturation") {
        rngslider.min = "0";
        rngslider.max = "200";
        rngslider.value = filtvals[currfilt];
        filtval.innerText = `${filtvals[currfilt]}%`;
    } else if(currfilt === "blur") {
        rngslider.min = "0";
        rngslider.max = "20";
        rngslider.value = filtvals[currfilt];
        filtval.innerText = `${filtvals[currfilt]}px`;
    } else if(currfilt === "rotate") {
        rngslider.min = "0";
        rngslider.max = "360";
        rngslider.value = filtvals[currfilt];
        filtval.innerText = `${filtvals[currfilt]}°`;
    } else {
        // inversion grayscale sepia
        rngslider.min = "0";
        rngslider.max = "100";
        rngslider.value = filtvals[currfilt];
        filtval.innerText = `${filtvals[currfilt]}%`;
    }
    
    // set step based on roll num
    rngslider.step = stepval;
};

// filter btn clicks
filtbtns.forEach(btn => {
    btn.onclick = () => {
        // remove active class from all
        filtbtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        // set curr filter
        currfilt = btn.getAttribute("data-filter");
        updslider();
    };
});

// slider input evt - happens while dragging
rngslider.oninput = () => {
    const val = parseInt(rngslider.value);
    
    // update display val with correct unit
    if(currfilt === "blur") {
        filtval.innerText = `${val}px`;
    } else if(currfilt === "rotate") {
        filtval.innerText = `${val}\u00b0`;
    } else {
        filtval.innerText = `${val}%`;
    }
    
    // update filter val
    filtvals[currfilt] = val;
    
    // apply
    applyfilts();
};

// slider change evt - happens after release
rngslider.onchange = () => {
    const val = parseInt(rngslider.value);
    
    // enforce step logic
    const remainder = val % stepval;
    let snappedval = val;
    
    if(remainder !== 0) {
        // snap to nearest step
        if(remainder < stepval / 2) {
            snappedval = val - remainder;
        } else {
            snappedval = val + (stepval - remainder);
        }
        
        // make sure within bounds
        const minval = parseInt(rngslider.min);
        const maxval = parseInt(rngslider.max);
        if(snappedval < minval) snappedval = minval;
        if(snappedval > maxval) snappedval = maxval;
        
        // update slider
        rngslider.value = snappedval;
        filtvals[currfilt] = snappedval;
        
        // update display with correct unit
        if(currfilt === "blur") {
            filtval.innerText = `${snappedval}px`;
        } else if(currfilt === "rotate") {
            filtval.innerText = `${snappedval}\u00b0`;
        } else {
            filtval.innerText = `${snappedval}%`;
        }
        
        applyfilts();
    }
    
    // save to hist with correct unit
    let unit = "%";
    if(currfilt === "blur") unit = "px";
    else if(currfilt === "rotate") unit = "\u00b0";
    
    savstate(`${currfilt}: ${filtvals[currfilt]}${unit}`);
};

// rotate btns
rotleft.onclick = () => {
    rotation -= 90;
    applyfilts();
    savstate("Rotate Left 90°");
};

rotright.onclick = () => {
    rotation += 90;
    applyfilts();
    savstate("Rotate Right 90°");
};

flipx.onclick = () => {
    fliphval = fliphval === 1 ? -1 : 1;
    applyfilts();
    savstate("Flip Horizontal");
};

flipy.onclick = () => {
    flipvval = flipvval === 1 ? -1 : 1;
    applyfilts();
    savstate("Flip Vertical");
};

// save img functn
saveimgbtn.onclick = () => {
    if(!imgloaded) {
        alert("no img loaded");
        return;
    }
    
    // create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // calculate total rotation (button + slider)
    const totalrot = rotation + parseInt(filtvals.rotate);
    
    // handle rotation - swap dims if rotated 90 or 270
    const isrotated = (Math.abs(totalrot) % 180 === 90);
    
    if(isrotated) {
        canvas.width = imgprev.naturalHeight;
        canvas.height = imgprev.naturalWidth;
    } else {
        canvas.width = imgprev.naturalWidth;
        canvas.height = imgprev.naturalHeight;
    }
    
    // apply all filters to canvas
    const cssfilt = `brightness(${filtvals.brightness}%) saturate(${filtvals.saturation}%) invert(${filtvals.inversion}%) grayscale(${filtvals.grayscale}%) sepia(${filtvals.sepia}%) blur(${filtvals.blur}px)`;
    ctx.filter = cssfilt;
    
    // save ctx state
    ctx.save();
    
    // move to center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // apply total rotation
    ctx.rotate(totalrot * Math.PI / 180);
    
    // apply scale for flip
    ctx.scale(fliphval, flipvval);
    
    // draw img centered
    ctx.drawImage(
        imgprev,
        -imgprev.naturalWidth / 2,
        -imgprev.naturalHeight / 2,
        imgprev.naturalWidth,
        imgprev.naturalHeight
    );
    
    // restore ctx
    ctx.restore();
    
    // download
    const link = document.createElement("a");
    link.download = `edited-image-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
};

/* HISTORY & UNDO REDO IMPLEMENTATION */

// save curr state to hist
function savstate(action) {
    // dont save if no img loaded yet
    if(!imgloaded) return;
    
    // if we r in middle of hist, remove future states
    if(histidx < histstack.length - 1) {
        histstack = histstack.slice(0, histidx + 1);
    }
    
    // create state obj
    const state = {
        filtvals: {...filtvals}, // deep copy
        rotation: rotation,
        fliphval: fliphval,
        flipvval: flipvval,
        action: action
    };
    
    histstack.push(state);
    histidx++;
    
    // update ui
    updhist();
    updbtns();
}

// update hist list ui
function updhist() {
    histlist.innerHTML = "";
    
    histstack.forEach((state, idx) => {
        const li = document.createElement("li");
        li.className = "histitem";
        li.innerText = state.action;
        
        if(idx === histidx) {
            li.classList.add("active");
        }
        
        // click to jump to that state
        li.onclick = () => {
            jumptostate(idx);
        };
        
        histlist.appendChild(li);
    });
    
    // scroll to active
    const activeitem = histlist.querySelector(".histitem.active");
    if(activeitem) {
        activeitem.scrollIntoView({behavior: "smooth", block: "nearest"});
    }
}

// jump to specific state in hist
function jumptostate(idx) {
    histidx = idx;
    const state = histstack[histidx];
    
    // restore state
    filtvals = {...state.filtvals};
    rotation = state.rotation;
    fliphval = state.fliphval;
    flipvval = state.flipvval;
    
    // apply
    applyfilts();
    updslider(); // update slider pos
    updhist();
    updbtns();
}

// update undo redo btn states
function updbtns() {
    undobtn.disabled = (histidx <= 0);
    redobtn.disabled = (histidx >= histstack.length - 1);
}

// undo functn
undobtn.onclick = () => {
    if(histidx > 0) {
        jumptostate(histidx - 1);
    }
};

// redo functn
redobtn.onclick = () => {
    if(histidx < histstack.length - 1) {
        jumptostate(histidx + 1);
    }
};