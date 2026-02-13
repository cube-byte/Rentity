package com.rentify.ProjectRentify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.rentify.ProjectRentify.entity.Pais;
import com.rentify.ProjectRentify.entity.Region;
import com.rentify.ProjectRentify.service.PaisService;
import com.rentify.ProjectRentify.service.RegionService;

@Controller
@RequestMapping("/pais")//Este es como se llama el html si no me equivoco
public class PaisController {
	
	@Autowired
    private PaisService paisService;

    @Autowired
    private RegionService regionService;

    @GetMapping
    public String listarPaises(Model model) {
        model.addAttribute("paises", paisService.listarTodos());
        return "listarPais"; //html
    }

    @GetMapping("/nuevo")
    public String mostrarFormularioNuevo(Model model) {
        model.addAttribute("pais", new Pais());
        model.addAttribute("regiones", regionService.listarTodos());
        model.addAttribute("titulo", "Nuevo País");
        return "formularioPais"; //html
    }

    @PostMapping("/guardar")
    public String guardarPais(@ModelAttribute Pais pais, RedirectAttributes redirectAttributes) {
        try {
            // Verificamos que la región tenga ID
            if (pais.getRegion() != null && pais.getRegion().getId() != null) {
                Region region = regionService.buscarPorId(pais.getRegion().getId());
                pais.setRegion(region);
            }
            boolean esNuevo = (pais.getId() == null);
            paisService.guardar(pais);

            if (esNuevo) {
                redirectAttributes.addFlashAttribute("mensaje", "País registrado correctamente.");
            } else {
                redirectAttributes.addFlashAttribute("mensaje", "País actualizado correctamente.");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ocurrió un error al guardar el país.");
        }

        return "redirect:/pais"; //html
    }

    @GetMapping("/editar/{id}")
    public String editarPais(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        Pais pais = paisService.buscarPorId(id);
        if (pais == null) {
            redirectAttributes.addFlashAttribute("error", "El país no existe.");
            return "redirect:/pais"; //html
        }
        model.addAttribute("pais", pais);
        model.addAttribute("regiones", regionService.listarTodos());
        model.addAttribute("titulo", "Editar País");
        return "formularioPais"; //html
    }

    @GetMapping("/eliminar/{id}")
    public String eliminarPais(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            paisService.eliminar(id);
            redirectAttributes.addFlashAttribute("mensaje", "País eliminado correctamente.");
        } catch (Exception e) {
            // Error al eliminar por FK u otro problema
            redirectAttributes.addFlashAttribute("error", "Ocurrio un error al eliminar el pais.");
        }
        return "redirect:/pais"; //html
    }

}
