package com.rentify.ProjectRentify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.rentify.ProjectRentify.entity.Region;
import com.rentify.ProjectRentify.service.RegionService;

@Controller
@RequestMapping("/region") //Este es como se llama el html si no me equivoco
public class RegionController {
	
	@Autowired
    private RegionService regionService;

    @GetMapping
    public String listarRegiones(Model model) {
        model.addAttribute("regiones", regionService.listarTodos());
        return "listarRegion"; //html
    }

    @GetMapping("/nuevo")
    public String mostrarFormularioNuevo(Model model) {
        model.addAttribute("region", new Region());
        model.addAttribute("titulo", "Nueva Región");
        return "formularioRegion";
    }

    @PostMapping("/guardar")
    public String guardarRegion(@ModelAttribute Region region, RedirectAttributes redirectAttributes) {
        try {
            boolean esNuevo = (region.getId() == null);
            regionService.guardar(region);

            if (esNuevo) {
                redirectAttributes.addFlashAttribute("mensaje", "Región registrada correctamente.");
            } else {
                redirectAttributes.addFlashAttribute("mensaje", "Región actualizada correctamente.");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ocurrió un error al guardar la región.");
        }

        return "redirect:/region"; //html
    }

    @GetMapping("/editar/{id}")
    public String editarRegion(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        Region region = regionService.buscarPorId(id);
        if (region == null) {
            redirectAttributes.addFlashAttribute("error", "La región no existe.");
            return "redirect:/region"; //html
        }
        model.addAttribute("region", region);
        model.addAttribute("titulo", "Editar Región");
        return "formularioRegion"; //html
    }

    @GetMapping("/eliminar/{id}")
    public String eliminarRegion(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            regionService.eliminar(id);
            redirectAttributes.addFlashAttribute("mensaje", "Región eliminada correctamente.");
        } catch (Exception e) {
            // Este error normalmente ocurre cuando la región está siendo usada por otra tabla (por FK)
            redirectAttributes.addFlashAttribute("error", "Ocurrio un error al eliminar la region");
        }
        return "redirect:/region"; //html
    }

}
