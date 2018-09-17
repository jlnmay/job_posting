using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JobPosting.Models;
using Microsoft.AspNet.Identity;

namespace JobPosting.Controllers
{
    public class JobController : Controller
    {
        private ApplicationDbContext _context;

        public JobController()
        {
            _context = new ApplicationDbContext();
        }

        public ActionResult Index()
        {
            // Getting jobs posting 
            IEnumerable<JobViewModel> JobsList = null;
            JobsList = new JobModel().GetPostedJobs(User.Identity.GetUserId());
            

            return View(JobsList);
        }

        [HttpPost]
        [Route("Job/Save")]
        public JsonResult Save(JobViewModel JobViewModel)
        {
            Job Job = new Job(); 

            if (JobViewModel.Id == 0)
            {
                Job.Title = JobViewModel.Title;
                Job.Description = JobViewModel.Description;
                Job.ContactEmail = JobViewModel.ContactEmail;
                Job.UserId = User.Identity.GetUserId(); 
                _context.Job.Add(Job);
            }
            else
            {
                Job = _context.Job.Find(JobViewModel.Id);
                Job.Title = JobViewModel.Title;
                Job.Description = JobViewModel.Description;
                Job.ContactEmail = JobViewModel.ContactEmail;
            }

            _context.SaveChanges(); 
            
            return Json(Job);
        }
        
        [Route("Job/GetRowById")]
        public JsonResult GetRowById(int id)
        {
            var JobModel = _context.Job.Find(id);

            return Json(JobModel, JsonRequestBehavior.AllowGet);       
        }

        [HttpPost]
        [Route("Job/Delete")]
        public JsonResult Delete(int id)
        {
            var JobModel = _context.Job.Find(id);
            _context.Job.Attach(JobModel);
            _context.Job.Remove(JobModel);
            _context.SaveChanges();

            var json = new Dictionary<string, string>();
            json.Add("success", true.ToString());
            json.Add("message", "Row was deleted successfully");

            return Json(json);
        }
    }
}