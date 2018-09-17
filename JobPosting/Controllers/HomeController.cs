using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JobPosting.Models;
using Microsoft.AspNet.Identity;

namespace JobPosting.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            // Getting jobs posting depeding on if user is authenticated
            IEnumerable<JobViewModel> JobsList = null;

            JobsList = new JobModel().GetPostedJobs(); 

            return View(JobsList);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}