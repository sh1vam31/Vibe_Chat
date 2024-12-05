let cnum=Math.floor(Math.random()*100)+1;
let attempt=0;
let attemptData=document.getElementById("Attempt");
let userinp=document.getElementById("inp");
let subBtn=documment.getElementById("submit");
let resBtn=document.getElementById("resBtn");
let message=document.getElementById("msg");
function check(){
 let usernum=parseInt(userinp.value);
 if(cnum==usernum){
    message.innerHTML="congratulations you have guessed the number!";
   message.style.color="green";
   resBtn.style.display="block";
 }else if(cnum<usernum){
    message.innerHTML="too high! try again";
    message.style.color="red";
 }else{
    message.innerHTML="too low! try again";
    message.style.color="red";
 }
 attempt++;
 attemptData.innerHTML=attempt;
 
setTimeout(()=>{
userinp.value="";
},100
);

}
function restart(){
     cnum=Math.floor(Math.random()*100)+1;
attempt=0;

}
subBtn.addEventListener("click",check);
resBtn.addEventListener("click",check)
// usernum.value="";
// MessageEvent.innerH