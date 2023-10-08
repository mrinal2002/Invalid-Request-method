const express=require("express");
const app=express();
const fs=require("fs");
const path=require("path");

const session=require("express-session");
const cookieperser=require("cookie-parser");

app.use(cookieperser());
const oneday=1000*60*60*24;
app.use(session({
    secret : 'df373&(^(()-kf',
    saveUninitialized:true,
    resave:false,
    cookie:{maxAge:oneday}
}))

app.get("/dashboard.html",(req,res)=>{
    if(req.session.name && req.session.gender && req.session.age){
        res.sendFile(path.join(__dirname,"./public/dashboard.html"));
    }
    else{
        res.redirect("/login");
    }
})


app.use(express.static("public"));
app.use(express.urlencoded());


app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/signup.html"))
})

let requestcount=0;
app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/login.html"));
})
let count=0;
app.post("/login",(req,res)=>{
    fs.readFile("users.txt","utf-8",(err,data)=>{
        let orgData=JSON.parse(data);
        let result=orgData.filter((item)=>{
            if(item.name==req.body.name && item.gender==req.body.gender && item.age==req.body.age){
                return true;
            }
        })
        if(result.length==0){
            res.send(`Invalid request method ${count++}`)
        }
        else{
            req.session.name=req.body.name;
            req.session.gender=req.body.gender;
            req.session.age=req.body.age;
            res.redirect("/dashboard");
        }
    })
})

app.get("/dashboard",(req,res)=>{
    if(req.session.name && req.session.gender && req.session.age){
        res.sendFile(path.join(__dirname,"./public/dashboard.html"));
    }
    else{
        res.redirect("/signup");
    }
})

app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/login");
})

// app.get("/signup",(req,res)=>{
//    res.send(`Invalid method request ${requestcount++}`)
// })

app.get("/signup",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/signup.html"));
})

app.post("/signup",(req,res)=>{
    fs.readFile("users.txt","utf-8",(err,data)=>{
        let orgData=JSON.parse(data);
        let result=orgData.filter((item)=>{
            if(item.name==req.body.name && item.gender==req.body.gender && item.age==req.body.age){
                return true;
            }
        })
        if(result.length==0){
            let newData=req.body;
            orgData.push(newData);
            fs.writeFile("users.txt",JSON.stringify(orgData),(err)=>{
                console.log(orgData);
                res.send("signup successfull@!");
            })
        }
        else{
            res.send("Alredy signed up of this user please login");
        }
    })
})

app.listen(3000,(err)=>{
    console.log("server started on 3000");
})