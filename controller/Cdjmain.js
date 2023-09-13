// const { User } = require("../models");
const { consumers } = require('nodemailer/lib/xoauth2');
const db = require('../models');
const models = db.User;

let proj, recop, revw, proj_all, mypageData;

const main_set = async () => {
  proj = await models.Project.findAll({
    order:[['project_id','DESC']],
    limit: 8
  });

  recop = await models.Recoplearn.findAll({
    order:[['Recoplearn_id','DESC']],
    limit: 8
  });
  
  proj_all = await models.Project.findAll({}); 

  revw = await models.Review.findAll({});

}


//메인페이지 랜더
const main = (req, res) => {  
  res.render('main');
}  

//메인 페이지 데이터 전송
const main_post = async (req, res) => {
  await main_set();

  // 각 테이블의 데이터를 await으로 받아온 후 변수에 넣기
  const projectData = await proj;
  const copData = await recop;
  const revwData = await revw;
  const projDataAll = await proj_all;

  //불러와졌는지 체크
  // console.log('프로젝트', projectData);
  console.log('리코프런', copData);
  // console.log('리뷰', revwData);

  //각 데이터를 사용하기 쉽도록 객체로 만들 배열 만들기
  const proJson = {};
  const proJsonall = {};
  const recopJson ={};
  const revwJson = {};

    // 프로젝트 데이터 객체 만들기
  for( let i = 0; i < projectData.length; i++) {
    proJson[i] = 
    { 
      project_id: projectData[i].project_id,
     ptitle: projectData[i].title,
     pcontent: projectData[i].content,
     pvideo: projectData[i].video,
     pPeriod: projectData[i].pariod,
     pmembers: projectData[i].members,
     plink: projectData[i].link,
     }
  }


  for( let i = 0; i < projDataAll.length; i++) {
    proJsonall[i] = 
    { 
      project_id: projDataAll[i].project_id,
     ptitle: projDataAll[i].title,
     pcontent: projDataAll[i].content,
     pvideo: projDataAll[i].video,
     pPeriod: projDataAll[i].pariod,
     pmembers: projDataAll[i].members,
     plink: projDataAll[i].link,
     }
  }

     // 리코프런 데이터 객체 만들기
  for( let i = 0; i < copData.length; i++) {
    recopJson[i] = 
    { 

      recop_id: copData[i].Recoplearn_id,
      project_id: copData[i].project_id,
      front_num: copData[i].font_num,
      back_num: copData[i].back_num,
      front_goal_num: copData[i].font_goal_num,
      back_goal_num: copData[i].back_goal_num,
      crr_num: copData[i].current_num,
      goal_num: copData[i].goal_num,

     }
 }
  

  // 후기 데이터 객체 만들기
  for( let i = 0; i < revwData.length; i++) {
    revwJson[i] = 
     { 
      revw_id: revwData[i].review_id,
      r_userid: revwData[i].user_id,
      r_proid: revwData[i].project_id,
      revw_con: revwData[i].review_content,
      }
  }

  // console.log("check 프로",proJson);
  // console.log("check 리코",recopJson);
  // console.log("check 후기",revwJson);
  console.log('모든 프로젝트', proJsonall)


  res.json({ project : proJson, projAll : proJsonall, recop : recopJson, revw : revwJson});
};


// const my_set = async () => {
//   mypageData = await models.User.findAll({});
// }

/////////////////////////////////////////////////////////////////
//마이페이지

// const my_set = async () => {
  
//   proj_all = await models.Project.findAll({}); 

//   recop = await models.Recoplearn.findAll({});  

// }


const mypage = (req, res) => {
  res.render("mypage");
}

/////////////////////////////////////////////////////////////////////////////

const mypage_data = async (req, res) => {
  
  console.log(req.params);
  
  //유저 데이터 가져오기
  const user_id = req.params.id;
  const user = await models.User.findOne({
    where: { user_id },
  });
  const userJson = {
    user_id: user.user_id,
    nick_name: user.nick_name,
    email: user.email,
    pw: user.pw,
  };

  console.log(userJson);

  res.json({userD : userJson});
};

////////////////////////////////////////////////////////////////////////////

const myproj_data = async (req, res) => {
  
  console.log('내 프로젝트',req.params);

  const user_id = req.params.id;
  const user = await models.User.findOne({
    where: { user_id },
  });

  const user_proj = await models.MyProject.findAll({
    where: {user_id},
  });
  const uprojJson = {};
  for(let i = 0; i<user_proj.length; i++){
    uprojJson[i] = {
      uproj_id : user_proj[i].project_id,
    }
  }

  console.log(uprojJson[0].uproj_id);
  console.log(uprojJson[1].uproj_id);
  console.log(uprojJson[2].uproj_id);
  console.log(user_proj.length);

  

  const uproj_detail = {};
  const uproj_detail_basis = await models.Project.findAll({});

  for(let j=0; j<user_proj.length; j++){
    for(let i=0; i<uproj_detail_basis.length; i++){
      let uproj_id_val = uprojJson[j].uproj_id;//유저가 만든 프로젝트의 아이디 
      // console.log('접속 유저가 만든 프로젝트의 아이디', uproj_id_val);
      // console.log('비교할 전체 프로젝트의 아이디', uproj_detail_basis[i].project_id);
      if (uproj_id_val === uproj_detail_basis[i].project_id){
        uproj_detail[j] = {
          project_id: uproj_id_val,
          ptitle: uproj_detail_basis[i].title,
          pcontent: uproj_detail_basis[i].content,
          pvideo: uproj_detail_basis[i].video,
          pPeriod: uproj_detail_basis[i].pariod,
          pmembers: uproj_detail_basis[i].members,
          plink: uproj_detail_basis[i].link,
        };
      };
    }
  }

  console.log('나의 프로젝트 유저',user);
  console.log('나의 프로젝트',user_proj);
  console.log('프로젝트 찾아오기', uproj_detail);


  res.json({userProject : uproj_detail});

}




const likepro_data = async (req, res) => {
  console.log('내가 담은 프로젝트', req.params);

  const user_id = req.params.id;
  const user = await models.User.findOne({
    where: { user_id },
  });

  const like_cart = await models.Mycart.findAll({
    where: {user_id},
  });

  console.log(user);
  console.log(like_cart);


  const LprojJson ={};

  for(let i = 0; i<like_cart.length; i++){
      LprojJson[i] = {
        cart_id : like_cart[i].cart_id,
      }
  }

  console.log('카트 가져오기 위한 json',LprojJson);
  const CartId = {};
  const Cbasis = await models.Cart.findAll({});

  console.log(LprojJson[0].cart_id);
  console.log(Cbasis[0].cart_id)
  console.log(like_cart.length);

  for(let j=0; j<like_cart.length; j++){
    for(let i=0; i<Cbasis.length; i++){
      let cart_id_val = LprojJson[j].cart_id;
      // console.log(cart_id_val);
      // console.log('카트 비교',Cbasis[i].cart_id);
      
      if (cart_id_val === Cbasis[i].cart_id){
        CartId[j] = {
          cart_id : cart_id_val,
          proj_id_C : Cbasis[i].project_id 
        };
      };
    };
  }

  console.log(CartId);
  console.log(CartId[0].proj_id_C);

  const capro_detail = {};
  const pro_basis = await models.Project.findAll({});

  for(let j=0; j<like_cart.length; j++){
    for(let i=0; i<pro_basis.length; i++){
      let like_id_val = CartId[j].proj_id_C;//유저가 만든 프로젝트의 아이디 
      // console.log('접속 유저가 만든 프로젝트의 아이디', uproj_id_val);
      // console.log('비교할 전체 프로젝트의 아이디', pro_basis[i].project_id);
      if (like_id_val === pro_basis[i].project_id){
        capro_detail[j] = {
          project_id: like_id_val,
          ptitle: pro_basis[i].title,
          pcontent: pro_basis[i].content,
          pvideo: pro_basis[i].video,
          pPeriod: pro_basis[i].pariod,
          pmembers: pro_basis[i].members,
          plink: pro_basis[i].link,
        };
      };
    };
  }

  console.log('카트에 맞는 프로젝트',capro_detail);
  res.json({cartProj : capro_detail });


}

const recop_data = async (req, res) => {

  console.log('리코프런',req.params);
  
  const user_id = req.params.id;
  const recop = await models.UserRecoplearn.findAll({
    where: { user_id },
  });

  console.log(recop.length);


  const reid = {};
  for(let i=0; i<recop.length; i++){
    reid[i] = {
      recop_id : recop[i].Recoplearn_id,
    }
  }

  console.log(reid);


  const recop_basis = await models.Recoplearn.findAll({});

  console.log(recop.length);
  console.log(recop_basis.length);
  console.log(reid[0].recop_id);


  const recopJson = {};
  console.log(recop.length);
  for(let j = 0; j < recop.length; j++){
    for(let i = 0; i<recop_basis.length; i++){
      
      if (reid[j].recop_id === recop_basis[i].Recoplearn_id){
        recopJson[j] = {
          recop_id: reid[j].recop_id,
          proj_id: recop_basis[i].project_id,
          front_num: recop_basis[i].font_num,
          back_num: recop_basis[i].back_num,
          frontG_num: recop_basis[i].font_goal_num,
          backG_num: recop_basis[i].back_goal_num,
          crr_num: recop_basis[i].current_num,
          goal: recop_basis[i].goal_num,
        };
      };
    };
  }

  console.log('리코프런 사용자 데이터',recopJson);

  res.json({ recop : recopJson })

}


//마이페이지 데이터 받기
// const mypage_post = (req, res) => {

// };

module.exports = {
  main,
  main_post,
  mypage,
  mypage_data,
  myproj_data,
  likepro_data,
  recop_data,
  // mypage_post,
};