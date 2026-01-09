import { NextRequest, NextResponse } from 'next/server';
import { TemplateService } from '@/lib/templates/template-service';
import { CreateTemplateInput, UpdateTemplateInput } from '@/components/templates/TemplateType';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const templateId = searchParams.get('templateId');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const premium = searchParams.get('premium');
        const categories = searchParams.get('categories');

        // Fetch template categories with counts
        if (categories === 'true') {
            const categoryList = await TemplateService.getTemplateCategories();
            return NextResponse.json({ categories: categoryList });
        }

        // Fetch single template by templateId
        if (templateId) {
            const template = await TemplateService.getTemplateById(templateId);

            if (!template) {
                return NextResponse.json(
                    { error: 'Template not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({ template });
        }

        // Fetch premium templates
        if (premium === 'true') {
            const templates = await TemplateService.getPremiumTemplates();
            return NextResponse.json({ templates });
        }

        // Search templates by query
        if (search) {
            const templates = await TemplateService.searchTemplates(search);
            return NextResponse.json({ templates });
        }

        // Fetch templates by category
        if (category) {
            const templates = await TemplateService.getTemplatesByCategory(category);
            return NextResponse.json({ templates });
        }

        // Fetch all active public templates
        const templates = await TemplateService.getAllTemplates();
        return NextResponse.json({ templates });
    } catch (error) {
        console.error('GET /api/template error:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

/**
 * POST - Create a new template
 * Body: CreateTemplateInput
 */
export async function POST(req: NextRequest) {
    try {
        const body: CreateTemplateInput = await req.json();

        // Validate required fields
        if (!body.templateId || !body.label || !body.category || !body.content) {
            return NextResponse.json(
                {
                    error: 'Missing required fields: templateId, label, category, and content are required',
                },
                { status: 400 }
            );
        }

        // Check if a template with the same templateId already exists
        const existingTemplate = await TemplateService.getTemplateById(body.templateId);
        if (existingTemplate) {
            return NextResponse.json(
                { error: `Template with templateId '${body.templateId}' already exists` },
                { status: 409 }
            );
        }

        // Create the template
        const insertedId = await TemplateService.createTemplate(body);

        // Fetch the created template to return it
        const template = await TemplateService.getTemplateById(body.templateId);

        return NextResponse.json({ template, insertedId }, { status: 201 });
    } catch (error) {
        console.error('POST /api/template error:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

/**
 * PUT - Update an existing template
 * Query params: ?templateId=<template_id>
 * Body: UpdateTemplateInput
 */
export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const templateId = searchParams.get('templateId');
        const body: UpdateTemplateInput = await req.json();

        if (!templateId) {
            return NextResponse.json(
                { error: 'Missing templateId parameter' },
                { status: 400 }
            );
        }

        // Check if template exists
        const existingTemplate = await TemplateService.getTemplateById(templateId);
        if (!existingTemplate) {
            return NextResponse.json(
                { error: 'Template not found' },
                { status: 404 }
            );
        }

        // Update the template
        const success = await TemplateService.updateTemplate(templateId, body);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to update template' },
                { status: 500 }
            );
        }

        // Fetch and return the updated template
        const updatedTemplate = await TemplateService.getTemplateById(templateId);
        return NextResponse.json({ template: updatedTemplate });
    } catch (error) {
        console.error('PUT /api/template error:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Soft delete a template (sets status to inactive)
 * Query params: ?templateId=<template_id>
 */
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const templateId = searchParams.get('templateId');

        if (!templateId) {
            return NextResponse.json(
                { error: 'Missing templateId parameter' },
                { status: 400 }
            );
        }

        // Check if template exists
        const template = await TemplateService.getTemplateById(templateId);
        if (!template) {
            return NextResponse.json(
                { error: 'Template not found' },
                { status: 404 }
            );
        }

        // Soft delete the template
        const success = await TemplateService.deleteTemplate(templateId);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to delete template' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Template deleted successfully (soft delete)',
        });
    } catch (error) {
        console.error('DELETE /api/template error:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
